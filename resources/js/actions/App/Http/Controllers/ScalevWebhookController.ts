import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
const ScalevWebhookController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ScalevWebhookController.url(options),
    method: 'post',
})

ScalevWebhookController.definition = {
    methods: ["post"],
    url: '/webhooks/scalev',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
ScalevWebhookController.url = (options?: RouteQueryOptions) => {
    return ScalevWebhookController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
ScalevWebhookController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ScalevWebhookController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
    const ScalevWebhookControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ScalevWebhookController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScalevWebhookController::__invoke
 * @see app/Http/Controllers/ScalevWebhookController.php:19
 * @route '/webhooks/scalev'
 */
        ScalevWebhookControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ScalevWebhookController.url(options),
            method: 'post',
        })
    
    ScalevWebhookController.form = ScalevWebhookControllerForm
export default ScalevWebhookController