import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
export const v1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v1.url(options),
    method: 'get',
})

v1.definition = {
    methods: ["get","head"],
    url: '/c7-angle-1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
v1.url = (options?: RouteQueryOptions) => {
    return v1.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
v1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v1.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
v1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: v1.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
    const v1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: v1.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
        v1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v1.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-1'
 */
        v1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v1.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    v1.form = v1Form
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
export const v2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v2.url(options),
    method: 'get',
})

v2.definition = {
    methods: ["get","head"],
    url: '/c7-angle-2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
v2.url = (options?: RouteQueryOptions) => {
    return v2.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
v2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v2.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
v2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: v2.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
    const v2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: v2.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
        v2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v2.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-2'
 */
        v2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    v2.form = v2Form
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
export const v3 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v3.url(options),
    method: 'get',
})

v3.definition = {
    methods: ["get","head"],
    url: '/c7-angle-3',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
v3.url = (options?: RouteQueryOptions) => {
    return v3.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
v3.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: v3.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
v3.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: v3.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
    const v3Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: v3.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
        v3Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v3.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c7-angle-3'
 */
        v3Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: v3.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    v3.form = v3Form
const angle = {
    v1: Object.assign(v1, v1),
v2: Object.assign(v2, v2),
v3: Object.assign(v3, v3),
}

export default angle