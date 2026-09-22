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
const cocycle11 = {
    problem: Object.assign(problem, problem),
}

export default cocycle11