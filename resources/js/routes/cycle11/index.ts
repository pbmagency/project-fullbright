import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
export const scalevProof = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scalevProof.url(options),
    method: 'get',
})

scalevProof.definition = {
    methods: ["get","head"],
    url: '/c11-problem/scalev-proof',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
scalevProof.url = (options?: RouteQueryOptions) => {
    return scalevProof.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
scalevProof.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scalevProof.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
scalevProof.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scalevProof.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
    const scalevProofForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scalevProof.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
        scalevProofForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scalevProof.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\C11ScalevProofController::__invoke
 * @see app/Http/Controllers/C11ScalevProofController.php:10
 * @route '/c11-problem/scalev-proof'
 */
        scalevProofForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scalevProof.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scalevProof.form = scalevProofForm
const cycle11 = {
    scalevProof: Object.assign(scalevProof, scalevProof),
}

export default cycle11