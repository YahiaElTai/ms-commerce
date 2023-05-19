# # Create notification channel for alerts
# resource "google_monitoring_notification_channel" "email_notification_channel" {
#   display_name = "Yahia El Tai Email"
#   type         = "email"

#   labels = {
#     email_address = var.email_address
#   }
# }

# # Create uptime health check for services
# resource "google_monitoring_uptime_check_config" "uptime_checks" {
#   for_each = { for item in local.uptime_checks : item.display_name => item }

#   display_name = each.value.display_name
#   timeout      = "10s"
#   checker_type = "STATIC_IP_CHECKERS"
#   period       = "900s"

#   monitored_resource {
#     type = "uptime_url"
#     labels = {
#       project_id = var.project_id
#       host       = var.host
#     }
#   }

#   http_check {
#     accepted_response_status_codes {
#       status_value = 200
#     }
#     path = each.value.path
#   }
# }

# resource "google_monitoring_alert_policy" "alert_policies" {

#   for_each = { for item in local.uptime_checks : item.display_name => item }

#   display_name = each.value.alert_policy_display_name
#   combiner     = "OR"


#   notification_channels = [google_monitoring_notification_channel.email_notification_channel.id]

#   conditions {
#     display_name = "Failure of uptime check_id ${element(
#       split(
#         "/",
#         google_monitoring_uptime_check_config.uptime_checks[each.key].id
#       ),
#       length(
#         split(
#           "/",
#           google_monitoring_uptime_check_config.uptime_checks[each.key].id
#         )
#       ) - 1
#     )}"

#     condition_threshold {
#       filter = "metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"${element(
#         split(
#           "/",
#           google_monitoring_uptime_check_config.uptime_checks[each.key].id
#         ),
#         length(
#           split(
#             "/",
#             google_monitoring_uptime_check_config.uptime_checks[each.key].id
#           )
#         ) - 1
#       )}\" AND resource.type=\"uptime_url\""

#       aggregations {
#         alignment_period     = "1200s"
#         cross_series_reducer = "REDUCE_COUNT_FALSE"
#         per_series_aligner   = "ALIGN_NEXT_OLDER"
#         group_by_fields      = ["resource.label.*"]
#       }

#       duration        = "60s"
#       comparison      = "COMPARISON_GT"
#       threshold_value = 1

#       trigger {
#         count = 1
#       }
#     }
#   }

# }