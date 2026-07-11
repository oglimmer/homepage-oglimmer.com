#!/usr/bin/env bash

set -euo pipefail

# Define script metadata
SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Default configuration
DEFAULT_REGISTRIES=("ghcr.io/oglimmer")
DEFAULT_DEPLOYMENT="http-homepage-oglimmer-2025"
DEFAULT_IMAGE_NAME="homepage-oglimmer-2025"

# Helm chart location (single chart in helm/). Also the semver source of truth
# for `release` (Chart.yaml version/appVersion).
CHART_DIR="$SCRIPT_DIR/helm"
CHART_NAME="homepage-oglimmer-2025"

# Configuration variables (can be overridden by parameters)
REGISTRIES=("${DEFAULT_REGISTRIES[@]}")
IMAGES=()
DEPLOYMENT="$DEFAULT_DEPLOYMENT"
IMAGE_NAME="$DEFAULT_IMAGE_NAME"

# Default options (can be overridden by environment variables)
BUILD="${BUILD:-true}"
VERBOSE="${VERBOSE:-false}"
DRY_RUN="${DRY_RUN:-false}"
RESTART="${RESTART:-true}"
PUSH="${PUSH:-true}"
HELP=false
PLATFORM="${PLATFORM:-arm64}"
RELEASE_MODE=false
RELEASE_BUMP=""
SHOW_VERSION=false
DEV_COMMAND=""

# Kubernetes namespace for the deployment.
K8S_NAMESPACE="${K8S_NAMESPACE:-default}"

# Restart hook configuration. Used when kubectl is not available (e.g. CI build
# runners that can't reach the cluster directly). The hook triggers an
# in-cluster rollout; see restart_via_hook() below.
RESTART_HOOK_URL="${RESTART_HOOK_URL:-https://restart.oglimmer.com/restart}"

# Color output (only if terminal supports it)
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1; then
  BOLD="$(tput bold)"
  GREEN="$(tput setaf 2)"
  YELLOW="$(tput setaf 3)"
  RED="$(tput setaf 1)"
  BLUE="$(tput setaf 4)"
  RESET="$(tput sgr0)"
else
  BOLD="" GREEN="" YELLOW="" RED="" BLUE="" RESET=""
fi

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${RESET} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${RESET} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${RESET} $1" >&2
}

# Verbose logging
log_verbose() {
    if [[ "$VERBOSE" == true ]]; then
        echo -e "${BLUE}[VERBOSE]${RESET} $1"
    fi
}

# Execute command with dry-run and verbose support
execute_cmd() {
    local cmd="$1"

    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[DRY-RUN]${RESET} ${cmd}"
        return 0
    else
        log_verbose "Executing: $cmd"
        if [[ "$VERBOSE" == true ]]; then
            eval "$cmd"
        else
            eval "$cmd" >/dev/null 2>&1
        fi
    fi
}

# Read the chart version (semver source of truth) from helm/Chart.yaml.
chart_version() {
    grep '^version:' "$CHART_DIR/Chart.yaml" | head -1 | sed -E 's/version:[[:space:]]*//'
}

# Show usage information
show_help() {
    cat << EOF
Usage: ${SCRIPT_NAME} [OPTIONS] [COMMAND]

Build, deploy, and release the homepage application.

COMMANDS:
    build               Build and deploy (default)
    release             Bump semver (Chart.yaml), commit, tag, push & helm-push
    helm-push           Package and push the Helm chart to ${DEFAULT_REGISTRIES[0]}
    test                Install deps if needed, then run lint & build
    show                Show the current chart version

BUILD OPTIONS:
    -v, --verbose           Enable verbose output
    -n, --no-restart        Skip Kubernetes deployment restart
    --no-push               Skip pushing images to registry
    --dry-run               Show what would be done without executing

RELEASE OPTIONS:
    --bump major|minor|bugfix  Skip the interactive prompt and bump that semver part

    # Registry configuration options
    --registries "REG1,REG2"    Comma-separated list of registries to push to (default: ${DEFAULT_REGISTRIES[0]})
                               Images will be tagged as REGISTRY/$IMAGE_NAME
    --deployment NAME          Kubernetes deployment name (default: $DEFAULT_DEPLOYMENT)
    --image-name NAME          Docker image name (default: $DEFAULT_IMAGE_NAME)

    # Platform options
    --platform PLATFORM        Target platform(s) for Docker build:
                               - amd64: Build for AMD64/x86_64 architecture
                               - arm64: Build for ARM64 architecture
                               - multi: Build for both amd64 and arm64 (multi-platform)
                               - auto: Detect current platform automatically

    -h, --help              Show this help message

EXAMPLES:
    ${SCRIPT_NAME}                                          # Build and deploy with defaults
    ${SCRIPT_NAME} build -v                                 # Build and deploy with verbose output
    ${SCRIPT_NAME} build --registries my-registry.com       # Use custom registry
    ${SCRIPT_NAME} build --no-push                          # Build without pushing
    ${SCRIPT_NAME} build --platform amd64                   # Build for AMD64 only
    ${SCRIPT_NAME} build --dry-run                          # Show what would be done
    ${SCRIPT_NAME} release --bump minor                     # Non-interactive minor bump, tag & push
    ${SCRIPT_NAME} test                                     # Run lint & build (fresh-clone safe)
    ${SCRIPT_NAME} show                                     # Show the current chart version

ENVIRONMENT VARIABLES:
    DEPLOYMENT              Override default deployment name
    IMAGE_NAME             Override default image name
    PLATFORM                Override default platform (amd64|arm64|multi|auto)
    DEFAULT_REGISTRIES_ENV  Override default registries (comma-separated)
    VERBOSE                 Enable verbose mode (true/false)
    DRY_RUN                 Enable dry-run mode (true/false)
    PUSH                    Enable/disable pushing to registry (true/false)
    RESTART                 Enable/disable Kubernetes restart (true/false)
    K8S_NAMESPACE           Kubernetes namespace (default: default)
    RESTART_TOKEN           Bearer token for the restart hook. Used to restart
                            the deployment when kubectl is unavailable (e.g. CI).
    RESTART_HOOK_URL        Restart hook base URL (default: https://restart.oglimmer.com/restart)

RESTART BEHAVIOR:
    When a restart is requested, kubectl is used if available; otherwise the
    restart hook is called using RESTART_TOKEN. Pass --no-restart to skip.

EOF
}

# Parse command line arguments
parse_args() {
    # Check if first argument is a command
    if [[ $# -gt 0 ]]; then
        case $1 in
            build)
                BUILD=true
                shift
                ;;
            release)
                RELEASE_MODE=true
                shift
                ;;
            show)
                SHOW_VERSION=true
                shift
                ;;
            helm-push|test)
                DEV_COMMAND="$1"
                shift
                return
                ;;
            help|-h|--help)
                HELP=true
                shift
                ;;
        esac
    fi

    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -n|--no-restart)
                RESTART=false
                shift
                ;;
            --no-push)
                PUSH=false
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --registries)
                # Clear existing registries and parse comma-separated list
                REGISTRIES=()
                IFS=',' read -ra ADDR <<< "$2"
                for registry in "${ADDR[@]}"; do
                    REGISTRIES+=("$(echo "$registry" | xargs)")  # trim whitespace
                done
                shift 2
                ;;
            --deployment)
                DEPLOYMENT="$2"
                shift 2
                ;;
            --image-name)
                IMAGE_NAME="$2"
                shift 2
                ;;
            --platform)
                PLATFORM="$2"
                shift 2
                ;;
            --bump)
                RELEASE_BUMP="$2"
                shift 2
                ;;
            -h|--help)
                HELP=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Handle environment variable overrides
    DEPLOYMENT="${DEPLOYMENT:-$DEPLOYMENT}"
    IMAGE_NAME="${IMAGE_NAME:-$IMAGE_NAME}"
    PLATFORM="${DOCKER_PLATFORM:-$PLATFORM}"

    # Override default registries from environment if set
    if [[ -n "${DEFAULT_REGISTRIES_ENV:-}" ]]; then
        REGISTRIES=()
        IFS=',' read -ra ADDR <<< "$DEFAULT_REGISTRIES_ENV"
        for registry in "${ADDR[@]}"; do
            REGISTRIES+=("$(echo "$registry" | xargs)")
        done
    fi

    # Build image arrays from registries
    if [[ ${#REGISTRIES[@]} -gt 0 ]]; then
        IMAGES=()
        for registry in "${REGISTRIES[@]}"; do
            IMAGES+=("$registry/$IMAGE_NAME")
        done
    else
        # Fallback to defaults if no registries specified
        IMAGES=("${DEFAULT_REGISTRIES[0]}/$IMAGE_NAME")
    fi

    # Validate platform parameter
    if [[ -n "$PLATFORM" && ! "$PLATFORM" =~ ^(amd64|arm64|multi|auto)$ ]]; then
        log_error "Invalid platform: $PLATFORM. Must be one of: amd64, arm64, multi, auto"
        exit 1
    fi

    # Validate release bump parameter
    if [[ -n "$RELEASE_BUMP" && ! "$RELEASE_BUMP" =~ ^(major|minor|bugfix|patch)$ ]]; then
        log_error "Invalid --bump: $RELEASE_BUMP. Must be one of: major, minor, bugfix"
        exit 1
    fi

    # Validate conflicting options
    if [[ "$PUSH" == false && "$RESTART" == true ]]; then
        log_warning "Cannot restart deployment without pushing images. Setting --no-restart."
        RESTART=false
    fi
}

# Check if required tools are available
check_prerequisites() {
    # Tests only need Node/npm — no Docker, kubectl, helm or gh.
    if [[ "$DEV_COMMAND" == "test" ]]; then
        if ! command -v npm >/dev/null 2>&1; then
            log_error "npm is required to run tests but was not found in PATH"
            exit 1
        fi
        return
    fi

    local tools=("docker")

    # Add tools needed for release / helm-push.
    if [[ "$RELEASE_MODE" == true ]]; then
        tools+=("git")
    fi
    if [[ "$RELEASE_MODE" == true || "$DEV_COMMAND" == "helm-push" ]]; then
        tools+=("helm" "gh")
    fi

    local missing_deps=()
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_deps+=("$tool")
        fi
    done

    if [[ ${#missing_deps[@]} -gt 0 ]]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and try again." >&2
        exit 1
    fi

    # helm-push only needs helm + gh, not a Docker daemon.
    if [[ "$DEV_COMMAND" == "helm-push" ]]; then
        return
    fi

    # Restarting a deployment needs EITHER kubectl (direct rollout) OR a
    # RESTART_TOKEN (to call the restart hook). CI build runners have neither
    # cluster access nor kubectl and set RESTART_TOKEN instead. Fail early when a
    # restart is requested but neither path is available.
    if [[ "$RESTART" == true ]] && ! command -v kubectl >/dev/null 2>&1 && [[ -z "${RESTART_TOKEN:-}" ]]; then
        log_error "Restart requested but kubectl is not available and RESTART_TOKEN is not set"
        echo "Install kubectl, set RESTART_TOKEN, or pass --no-restart." >&2
        exit 1
    fi

    # Check if Docker daemon is running (skip in dry-run mode)
    if [[ "$DRY_RUN" != true ]] && ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon is not running"
        echo "Please start Docker and try again." >&2
        exit 1
    fi

    # Check if buildx is available for multi-platform builds
    if [[ "$PLATFORM" == "multi" ]]; then
        if ! docker buildx version &> /dev/null; then
            log_error "Docker buildx is required for multi-platform builds but not available"
            log_info "Please install Docker Desktop or enable buildx plugin"
            exit 1
        fi

        # Ensure buildx builder is available
        if ! docker buildx inspect &> /dev/null; then
            log_info "Creating buildx builder instance..."
            docker buildx create --use --name multiplatform-builder 2>/dev/null || true
        fi
    fi

    log_verbose "All required tools are available"
}

# Get platform arguments for docker build
get_platform_args() {
    local platform_args=""

    case "$PLATFORM" in
        "amd64")
            platform_args="--platform linux/amd64"
            ;;
        "arm64")
            platform_args="--platform linux/arm64"
            ;;
        "multi")
            platform_args="--platform linux/amd64,linux/arm64"
            ;;
        "auto"|"")
            # Let Docker detect the platform automatically
            platform_args=""
            ;;
    esac

    echo "$platform_args"
}

# Bump a semantic version string
bump_version() {
    local current_version="$1"
    local bump_type="$2"
    IFS='.' read -r major minor patch <<< "$current_version"

    case "$bump_type" in
        major)
            major=$((major + 1)); minor=0; patch=0;
            ;;
        minor)
            minor=$((minor + 1)); patch=0;
            ;;
        bugfix|patch)
            patch=$((patch + 1));
            ;;
        *)
            echo "Unknown bump type: $bump_type" >&2
            exit 1
            ;;
    esac
    echo "$major.$minor.$patch"
}

# Build Docker image for multiple targets
build_image() {
    local platform_args=$(get_platform_args)
    local image_tags=("${IMAGES[@]}")
    local primary_tag="${image_tags[0]}"

    log_info "Building homepage image for ${#image_tags[@]} target(s):"
    for tag in "${image_tags[@]}"; do
        log_info "  - $tag"
    done
    if [[ -n "$platform_args" ]]; then
        log_info "Target platform(s): $PLATFORM"
    fi

    local build_cmd=""

    # Use buildx for multi-platform builds or when platform is specified
    if [[ "$PLATFORM" == "multi" || (-n "$PLATFORM" && "$PLATFORM" != "auto") ]]; then
        build_cmd="docker buildx build $platform_args"

        # Add all tags
        for tag in "${image_tags[@]}"; do
            build_cmd="$build_cmd --tag $tag"
        done

        if [[ "$PUSH" == true ]]; then
            build_cmd="$build_cmd --push"
        else
            # For local builds with buildx, we need to load the image
            if [[ "$PLATFORM" != "multi" ]]; then
                build_cmd="$build_cmd --load"
            else
                log_warning "Multi-platform builds cannot be loaded locally, forcing push to registry"
                build_cmd="$build_cmd --push"
            fi
        fi

        # Add build context
        build_cmd="$build_cmd ."

    else
        # Use regular docker build for single platform or auto-detection
        # Build with primary tag first
        build_cmd="docker build $platform_args --tag $primary_tag ."

        # Tag for additional registries
        if [[ ${#image_tags[@]} -gt 1 ]]; then
            for tag in "${image_tags[@]:1}"; do
                build_cmd="$build_cmd && docker tag $primary_tag $tag"
            done
        fi

        # Push to all registries if requested
        if [[ "$PUSH" == true ]]; then
            for tag in "${image_tags[@]}"; do
                build_cmd="$build_cmd && docker push $tag"
            done
        fi
    fi

    log_verbose "Build command: $build_cmd"

    if execute_cmd "$build_cmd"; then
        log_success "Homepage image built successfully"
        if [[ "$PUSH" == false && "$PLATFORM" != "multi" ]]; then
            log_info "Homepage image tagged locally (not pushed)"
        elif [[ "$PUSH" == true ]]; then
            log_success "Homepage image pushed to ${#image_tags[@]} target(s)"
        fi
    else
        log_error "Failed to build homepage image"
        exit 1
    fi
}

# Restart a deployment via the in-cluster restart hook. Used when kubectl is
# not available (e.g. CI runners without cluster access). Never echoes the token.
restart_via_hook() {
    local deployment="$1"
    local url="${RESTART_HOOK_URL}/${K8S_NAMESPACE}/${deployment}"

    log_info "Restarting $deployment via hook: $url"

    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}[DRY-RUN]${RESET} curl -fsS -X POST -H 'Authorization: Bearer ***' $url"
        return 0
    fi

    if curl -fsS -X POST -H "Authorization: Bearer ${RESTART_TOKEN}" "$url" >/dev/null; then
        log_success "Deployment $deployment restarted successfully (via hook)"
    else
        log_error "Failed to trigger restart for $deployment via hook"
        exit 1
    fi
}

# Restart Kubernetes deployment. Prefer kubectl when available (local/dev with
# cluster access); otherwise fall back to the restart hook using RESTART_TOKEN
# (CI runners without cluster access).
restart_deployment() {
    local deployment="$1"

    log_info "Restarting deployment: $deployment"

    # No kubectl (e.g. CI) -> go through the restart hook.
    if ! command -v kubectl >/dev/null 2>&1; then
        restart_via_hook "$deployment"
        return
    fi

    if execute_cmd "kubectl rollout restart deployment/$deployment -n $K8S_NAMESPACE"; then
        log_success "Deployment $deployment restarted successfully"

        # Wait for rollout to complete if verbose
        if [[ "$VERBOSE" == true && "$DRY_RUN" != true ]]; then
            log_info "Waiting for rollout to complete..."
            kubectl rollout status deployment/"$deployment" -n "$K8S_NAMESPACE" --timeout=300s
        fi
    else
        log_error "Failed to restart deployment: $deployment"
        exit 1
    fi
}

# Package and push the Helm chart to ghcr.io/oglimmer as an OCI artifact.
cmd_helm_push() {
    local registry="${DEFAULT_REGISTRIES[0]}"
    local version
    version=$(chart_version)

    log_info "Authenticating to GHCR via gh CLI..."
    if ! gh auth token | helm registry login ghcr.io -u "$(gh api user --jq .login)" --password-stdin; then
        log_error "Failed to authenticate to GHCR"
        exit 1
    fi

    log_info "Packaging Helm chart v$version..."
    local tmp_dir
    tmp_dir=$(mktemp -d)
    trap "rm -rf '$tmp_dir'" EXIT

    if ! helm package "$CHART_DIR" -d "$tmp_dir"; then
        log_error "Failed to package Helm chart"
        exit 1
    fi

    log_info "Pushing Helm chart to oci://$registry..."
    if helm push "$tmp_dir/${CHART_NAME}-${version}.tgz" "oci://$registry"; then
        log_success "Helm chart v$version pushed to oci://$registry/${CHART_NAME}"
    else
        log_error "Failed to push Helm chart"
        exit 1
    fi
}

# Run the project checks non-interactively. Designed to work on a fresh clone:
# dependencies are installed from the lockfile (npm ci) when node_modules is
# missing, then lint and build run. Both are deterministic from the lockfile —
# the project has no separate unit-test suite. (typecheck is intentionally left
# out: `nuxi typecheck` fetches its TypeScript/vue-tsc toolchain on demand via
# npx rather than from the lockfile, so it isn't fresh-clone deterministic.)
cmd_test() {
    if [[ ! -d "$SCRIPT_DIR/node_modules" ]]; then
        log_info "Installing dependencies (npm ci)..."
        (cd "$SCRIPT_DIR" && npm ci)
    fi

    log_info "Running ESLint..."
    (cd "$SCRIPT_DIR" && npm run lint)

    log_info "Building project..."
    (cd "$SCRIPT_DIR" && npm run build)

    log_success "All checks passed"
}

# Execute build process
execute_build() {
    # Display configuration
    echo -e "${BOLD}=== Build Configuration ===${RESET}"
    echo "Image Name:        $IMAGE_NAME"
    echo "Registries:        ${REGISTRIES[*]}"
    echo "Platform:          ${PLATFORM:-auto}"
    echo "Push to Registry:  $PUSH"
    echo "Restart K8s:       $RESTART"
    echo "Deployment:        $DEPLOYMENT"
    echo "Dry-run:           $DRY_RUN"
    echo "Verbose:           $VERBOSE"
    echo -e "${BOLD}===========================${RESET}"
    echo

    log_info "Starting build process..."

    # Build image
    build_image

    # Restart deployment if requested
    if [[ "$RESTART" == true ]]; then
        restart_deployment "$DEPLOYMENT"
    else
        log_info "Skipping deployment restart (--no-restart specified)"
    fi

    echo
    echo -e "${BOLD}${GREEN}✓ All operations completed successfully${RESET}"
}

# Execute release process: bump the chart version, commit, tag and push. The
# tag push triggers the GitHub Actions release workflow, which builds and
# publishes the multi-arch image and creates the GitHub Release. The chart
# itself is pushed to GHCR here.
execute_release() {
    log_info "Starting release process..."

    local current_version
    current_version=$(chart_version)
    echo "Current chart version: $current_version"; echo

    local bump
    if [[ -n "$RELEASE_BUMP" ]]; then
        bump="$RELEASE_BUMP"
        log_info "Bump type from --bump: $bump"
    else
        echo "Select which part to bump (semantic versioning):"
        echo "  1) major  - incompatible changes"
        echo "  2) minor  - backwards-compatible new features"
        echo "  3) bugfix - backwards-compatible bug fixes"
        PS3="Enter choice (1-3): "
        select bump in major minor bugfix; do
            if [[ -n "$bump" ]]; then
                echo "Chosen bump type: $bump"; break
            else
                echo "Invalid choice. Please select 1, 2, or 3.";
            fi
        done
    fi

    local new_version
    new_version=$(bump_version "$current_version" "$bump")
    log_info "Releasing version $new_version..."

    # Update Helm chart version and appVersion (semver source of truth).
    local chart_file="$CHART_DIR/Chart.yaml"
    log_info "Updating Helm chart version to $new_version..."
    sed -i '' "s/^version:.*/version: $new_version/" "$chart_file"
    sed -i '' "s/^appVersion:.*/appVersion: \"$new_version\"/" "$chart_file"

    # Commit, tag, and push — the tag push triggers the release workflow.
    log_info "Committing version change and creating tag..."
    git add "$chart_file"
    git commit -m "Release v$new_version"
    git tag -a "v$new_version" -m "Release v$new_version"

    log_info "Pushing commit and tag to origin..."
    git push origin HEAD
    git push origin "v$new_version"

    log_success "Release v$new_version tagged and pushed. GitHub Actions will build and publish the image."

    cmd_helm_push
}

# Main execution function
main() {
    # Show help if no arguments provided
    if [[ $# -eq 0 ]]; then
        show_help
        exit 0
    fi

    parse_args "$@"

    if [[ "$HELP" == true ]]; then
        show_help
        exit 0
    fi

    if [[ "$SHOW_VERSION" == true ]]; then
        echo "Chart version: $(chart_version)"
        exit 0
    fi

    check_prerequisites

    if [[ "$DEV_COMMAND" == "helm-push" ]]; then
        cmd_helm_push
        exit 0
    fi

    if [[ "$DEV_COMMAND" == "test" ]]; then
        cmd_test
        exit 0
    fi

    if [[ "$RELEASE_MODE" == true ]]; then
        execute_release
    else
        execute_build
    fi
}

# Run main function with all arguments
main "$@"
