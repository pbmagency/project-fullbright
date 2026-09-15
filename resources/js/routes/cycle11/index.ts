import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
export const problem = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: problem.url(options),
    method: 'get',
})

problem.definition = {
    methods: ["get","head"],
    url: '/c11-problem',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
problem.url = (options?: RouteQueryOptions) => {
    return problem.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
problem.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: problem.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
problem.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: problem.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
    const problemForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: problem.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
        problemForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: problem.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c11-problem'
 */
        problemForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: problem.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    problem.form = problemForm
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
    problem: Object.assign(problem, problem),
scalevProof: Object.assign(scalevProof, scalevProof),
}

export default cycle11