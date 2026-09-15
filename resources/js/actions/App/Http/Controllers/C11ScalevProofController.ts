import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
const C11ScalevProofController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: C11ScalevProofController.url(options),
    method: 'get',
})

C11ScalevProofController.definition = {
    methods: ["get","head"],
    url: '/c11-problem/scalev-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
C11ScalevProofController.url = (options?: RouteQueryOptions) => {
    return C11ScalevProofController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
C11ScalevProofController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: C11ScalevProofController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
C11ScalevProofController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: C11ScalevProofController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
    const C11ScalevProofControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: C11ScalevProofController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
        C11ScalevProofControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: C11ScalevProofController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
        C11ScalevProofControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: C11ScalevProofController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    C11ScalevProofController.form = C11ScalevProofControllerForm
export default C11ScalevProofController