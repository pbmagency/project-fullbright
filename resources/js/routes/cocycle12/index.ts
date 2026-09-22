import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
export const price = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: price.url(options),
    method: 'get',
})

price.definition = {
    methods: ["get","head"],
    url: '/c12-price',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
price.url = (options?: RouteQueryOptions) => {
    return price.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
price.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: price.url(options),
    method: 'get',
})
/**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
price.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: price.url(options),
    method: 'head',
})

    /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
    const priceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: price.url(options),
        method: 'get',
    })

            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
        priceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: price.url(options),
            method: 'get',
        })
            /**
* @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/c12-price'
 */
        priceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: price.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    price.form = priceForm
const cocycle12 = {
    price: Object.assign(price, price),
}

export default cocycle12