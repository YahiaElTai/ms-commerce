{{- define "ms-ingress.ingress.annotations" -}}
kubernetes.io/ingress.class: nginx
nginx.ingress.kubernetes.io/use-regex: 'true'
{{- $servicename := (index .Values.ingress.services 0).name -}}
{{- $serviceport := (index .Values.ingress.services 0).port -}}
{{- printf "\n" -}}
nginx.ingress.kubernetes.io/auth-url: {{- printf "http://%s.default.svc.cluster.local:%v/api/account/authenticate" $servicename $serviceport | indent 1 }}
nginx.ingress.kubernetes.io/auth-method: POST
nginx.ingress.kubernetes.io/auth-response-headers: UserId,UserEmail,ProjectKey
{{- end }}
