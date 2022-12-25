{{/*
Expand the name of the chart.
*/}}
{{- define "ms-commerce-cart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "ms-commerce-cart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}


{{/*
Common labels
*/}}
{{- define "ms-commerce-cart.labels" -}}
{{ include "ms-commerce-cart.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "ms-commerce-cart.selectorLabels" -}}
app: {{ include "ms-commerce-cart.name" . }}
instance: {{ .Release.Name }}
{{- end }}

{{/*
Cloud SQL proxy instance to connect to Cloud SQL database instance
*/}}
{{- define "ms-commerce-cart.postgresql-instances" -}}
{{ printf "-instances=%s" .Values.postgresql.instance | quote -}}
{{- end }}