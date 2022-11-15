### Recreate GCP Project for production

1.  Create a new project and connect a billing account
2.  Create a custom Virtual Private Cloud (VCP)

    1. Create subnets in `europe-west-1` and `us-central1` regions with IPv4 10.181.0.0/20 and 10.182.0.0/20
    2. Enable recommended firewall rules

3.  Enable and configure Artifact Registry

    1. Enable Artifact Registry API and create a new repository
    2. Push your services images to the repository following [the setup instructions](https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling)

4.  Enable and configure Cloud Pub/Sub

    1. Enable Cloud Pub/Sub API
    2. create all topics required by your project
    3. Create all subscriptions required by your project

5.  Create GKE Cluster

    1. Enable Kubernetes Engine API
    2. Create a cluster with the following properties
       - Specify a zone within the custom VPC created above
       - Under Networking, select the VPC created above
       - Under Security, enable Workload Identity
    3. Connect to cluster

       `gcloud container clusters get-credentials <cluster_name> --zone <zone> --project <project>`

    4. Ensure you are on the correct context

       ```bash
          # see all the available context
          $ kubectl config get-contexts
          # pick the context you want to currently use
          $ kubectl config use-context <context-name>

          # extra: see detailed list of config/contexts
          $ kubectl config view
       ```

6.  create JWT_KEY as a secret

    `kubectl create secret generic jwt-secret --from-literal=JWT_KEY={YOUR_JWT_KEY_HERE}`

7.  Allow KGE workloads to connect Cloud Pub/Sub via [Workload Identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)

    - Make sure to use the kuberentes service account you create in all services which needs to connect to Cloud Pub/Sub and annotate it properly as described.

8.  Apply Kubernetes manifests

    `kubectl apply -f infa/k8s`

9.  point the domain name to ingress load balancer external IP address.
