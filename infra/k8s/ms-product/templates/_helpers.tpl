{{/*
Expand the name of the chart.
*/}}
{{- define "ms-product.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "ms-product.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}


{{/*
Common labels
*/}}
{{- define "ms-product.labels" -}}
{{ include "ms-product.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "ms-product.selectorLabels" -}}
app: {{ include "ms-product.name" . }}
instance: {{ .Release.Name }}
{{- end }}

{{/*
Cloud SQL proxy instance to connect to Cloud SQL database instance
*/}}
{{- define "ms-product.postgresql-instances" -}}
{{ printf "-instances=%s" .Values.postgresql.instance | quote -}}
{{- end }}