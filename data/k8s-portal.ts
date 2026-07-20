export interface K8sPortalItem {
  imageSrc: string
  title: string
  text: string
  linkData: [string, string][]
  techList?: string
}

export const k8sPortalItems: K8sPortalItem[] = [
  {
    imageSrc: "rancher.jpeg",
    title: "Keycloak",
    text: "Identity and Access Management",
    linkData: [
      ["https://id.oglimmer.de/", "Admin"],
      ["https://www.keycloak.org/", "Documentation"],
    ],
    techList: "[idp, oauth, saml, oidc, keycloak]",
  },
  {
    imageSrc: "longhorn.jpeg",
    title: "Longhorn Persistent Storage",
    text: "Cloud native distributed block storage for Kubernetes",
    linkData: [
      ["https://longhorn.oglimmer.com/", "Dashboard"],
      ["https://longhorn.io/", "Home page"],
    ],
    techList: "[k8s, longhorn, storage]",
  },
  {
    imageSrc: "traefik.jpeg",
    title: "Traefik Ingress Controller",
    text: "Cloud Native Application Proxy",
    linkData: [
      ["https://traefik.oglimmer.com/", "Dashboard"],
      ["https://traefik.io/traefik/", "Home page"],
    ],
    techList: "[k8s, traefik, reverse-proxy]",
  },
  {
    imageSrc: "registry.jpeg",
    title: "Container Registry",
    text: "Simple and secure container image registry",
    linkData: [
      ["https://registry.oglimmer.com/ui/", "Dashboard"],
      ["https://distribution.github.io/distribution/", "Home page"],
    ],
    techList: "[k8s, docker, container-registry, container]",
  },
  {
    imageSrc: "grafana.jpeg",
    title: "Grafana Monitoring",
    text: "The open platform for beautiful analytics and monitoring",
    linkData: [
      ["https://grafana.oglimmer.de/", "Dashboard"],
      ["https://grafana.com/", "Home page"],
    ],
    techList: "[k8s, dashboard, monitoring, grafana, prometheus, loki]",
  },
  {
    imageSrc: "maven.jpeg",
    title: "Maven Repository",
    text: "Maven based artifacts for JVM ecosystem",
    linkData: [
      ["https://mvn.oglimmer.com/", "Dashboard"],
      ["https://reposilite.com/", "Home page"],
    ],
    techList: "[k8s, mvn, maven, repository]",
  },
  {
    imageSrc: "git-deploy-control.jpeg",
    title: "Release Management UI",
    text: "Custom build system for git based version control",
    linkData: [["https://git-deploy-control.oglimmer.com/", "Dashboard"]],
    techList: "[k8s, continuous-deployment, git, deployment]",
  },
  {
    imageSrc: "haproxy.jpeg",
    title: "HAProxy",
    text: "Network load balancer / layer 4 reverse proxy",
    linkData: [
      ["https://haproxy.oglimmer.com/", "Dashboard"],
      ["https://www.haproxy.org/", "Home page"],
    ],
    techList: "[haproxy, reverse-proxy]",
  },
  {
    imageSrc: "backup.jpeg",
    title: "Cloud-Backup",
    text: "Custom build backup using Google Drive",
    linkData: [["https://backup.oglimmer.com/", "Dashboard"]],
    techList: "[backup, google-drive]",
  },
  {
    imageSrc: "argocd.jpeg",
    title: "Argo CD",
    text: "Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes",
    linkData: [["https://argocd.oglimmer.com/", "Dashboard"]],
    techList: "[k8s, continuous-deployment, git, deployment]",
  },
  {
    imageSrc: "pgadmin.jpeg",
    title: "pgAdmin",
    text: "Web-based administration and management tool for PostgreSQL databases",
    linkData: [
      ["https://pgadmin.oglimmer.com/", "Dashboard"],
      ["https://www.pgadmin.org/", "Home page"],
    ],
    techList: "[k8s, postgres, database, pgadmin]",
  },
]

// Helper function to parse tech list string (same as in projects.ts)
export function parseTechList(techList?: string): string[] {
  if (!techList) return []
  // Remove brackets and split by comma
  return techList
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0)
}
