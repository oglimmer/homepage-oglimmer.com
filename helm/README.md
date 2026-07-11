# Homepage Oglimmer 2025 Helm Chart

Helm chart for deploying the personal homepage built with Nuxt 3.

## Prerequisites

- Kubernetes cluster
- Helm 3.x
- kubectl configured
- cert-manager installed (for automatic TLS certificates)

## Container Image

The image is published to GitHub Container Registry (public), so no image pull
secret is required:

```
ghcr.io/oglimmer/homepage-oglimmer-2025:latest
```

If you mirror the image to a private registry, add the pull secret to
`imagePullSecrets` in `values.yaml`.

## Installation

### Install from local chart

```bash
# Install with default values (production)
helm install homepage ./helm

# Install with custom values for development
helm install homepage ./helm -f ./helm/custom-values.yaml

# Install in a specific namespace
helm install homepage ./helm --namespace production --create-namespace
```

### Upgrade

```bash
# Upgrade existing deployment
helm upgrade homepage ./helm

# Upgrade with new image tag
helm upgrade homepage ./helm --set image.tag=v1.2.3

# Force rollout restart (pulls latest tag)
kubectl rollout restart deployment/homepage
```

### Uninstall

```bash
helm uninstall homepage
```

## Configuration

### Key Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `imagePullSecrets` | Image pull secrets (public image needs none) | `[]` |
| `replicaCount` | Number of replicas | `2` |
| `image.repository` | Full image repository (with registry) | `ghcr.io/oglimmer/homepage-oglimmer-2025` |
| `image.pullPolicy` | Image pull policy | `Always` |
| `image.tag` | Image tag | `latest` |
| `service.type` | Service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Container target port | `8080` |

### Ingress Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.certManager.enabled` | Enable cert-manager annotations | `true` |
| `ingress.certManager.clusterIssuer` | Cert-manager cluster issuer | `oglimmer-com-dns` |
| `ingress.hosts` | List of hosts and paths | See values.yaml |
| `ingress.tls.enabled` | Enable TLS | `true` |
| `ingress.tls.secretName` | TLS secret name | `tls-homepage-oglimmer-ingress-dns` |
| `ingress.tls.hosts` | TLS hosts | `[oglimmer.com, www.oglimmer.com, oglimmer.de, www.oglimmer.de]` |

Default domains configured:
- `oglimmer.com`
- `www.oglimmer.com`
- `oglimmer.de`
- `www.oglimmer.de`

### Security Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `securityContext.runAsNonRoot` | Run as non-root user | `true` |
| `securityContext.runAsUser` | User ID | `1001` |
| `podSecurityContext.fsGroup` | Filesystem group | `1001` |

### Resource Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.limits.cpu` | CPU limit | `100m` |
| `resources.limits.memory` | Memory limit | `128Mi` |
| `resources.requests.cpu` | CPU request | `50m` |
| `resources.requests.memory` | Memory request | `64Mi` |

### Autoscaling

| Parameter | Description | Default |
|-----------|-------------|---------|
| `autoscaling.enabled` | Enable HPA | `false` |
| `autoscaling.minReplicas` | Minimum replicas | `2` |
| `autoscaling.maxReplicas` | Maximum replicas | `10` |
| `autoscaling.targetCPUUtilizationPercentage` | Target CPU % | `80` |

### High Availability

| Parameter | Description | Default |
|-----------|-------------|---------|
| `podDisruptionBudget.enabled` | Enable PDB | `false` |
| `podDisruptionBudget.minAvailable` | Minimum available pods | `1` |

## Examples

### Development Environment

```bash
# Use custom values with reduced resources
helm install homepage ./helm -f ./helm/custom-values.yaml
```

### Custom domain

```bash
# Override default domains
helm install homepage ./helm \
  --set ingress.hosts[0].host=example.com \
  --set ingress.tls.hosts[0]=example.com
```

### Custom image tag

```bash
# Deploy specific version
helm install homepage ./helm --set image.tag=v1.2.3
```

### Different cert-manager issuer

```bash
# Use letsencrypt-prod issuer
helm install homepage ./helm \
  --set ingress.certManager.clusterIssuer=letsencrypt-prod
```

### Enable high availability

```bash
# Enable autoscaling and pod disruption budget
helm install homepage ./helm \
  --set autoscaling.enabled=true \
  --set podDisruptionBudget.enabled=true
```

## TLS/SSL Certificates

This chart uses cert-manager for automatic TLS certificate provisioning. The default configuration uses DNS-01 challenge with the cluster issuer `oglimmer-com-dns`.

### Certificate Manager Setup

Ensure your cluster has cert-manager installed and configured with the appropriate ClusterIssuer:

```bash
# Check cert-manager is running
kubectl get pods -n cert-manager

# Verify ClusterIssuer exists
kubectl get clusterissuer oglimmer-com-dns
```

The TLS certificate will be automatically requested and renewed by cert-manager.

## Verification

```bash
# Check all resources
kubectl get all -l app.kubernetes.io/name=homepage-oglimmer-2025

# Check certificate status
kubectl get certificate

# View deployment status
kubectl get deployments
kubectl describe deployment homepage

# View pods
kubectl get pods
kubectl logs -l app.kubernetes.io/name=homepage-oglimmer-2025

# Check service
kubectl get services
kubectl describe service homepage

# Check ingress
kubectl get ingress
kubectl describe ingress homepage

# Test the application
curl -v https://oglimmer.com
curl -v https://www.oglimmer.com
curl -v https://oglimmer.de
curl -v https://www.oglimmer.de
```

## Troubleshooting

### Image Pull Errors

```bash
# Test pulling image manually (the image is public)
docker pull ghcr.io/oglimmer/homepage-oglimmer-2025:latest
```

### Certificate Issues

```bash
# Check certificate status
kubectl describe certificate tls-homepage-oglimmer-ingress-dns

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager

# Check certificate request
kubectl get certificaterequest
kubectl describe certificaterequest <name>
```

### Pod Not Starting

```bash
# Check pod events
kubectl describe pod <pod-name>

# Check pod logs
kubectl logs <pod-name>

# Check security context issues
kubectl get pod <pod-name> -o yaml | grep -A 10 securityContext
```
