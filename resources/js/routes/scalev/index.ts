import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/webhooks/scalev',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
    const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: webhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
        webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: webhook.url(options),
            method: 'post',
        })
    
    webhook.form = webhookForm
const scalev = {
    webhook: Object.assign(webhook, webhook),
}

export default scalev