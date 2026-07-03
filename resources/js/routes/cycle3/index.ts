import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
export const agitation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation.url(options),
    method: 'get',
})

agitation.definition = {
    methods: ["get","head"],
    url: '/c3-problem',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
agitation.url = (options?: RouteQueryOptions) => {
    return agitation.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
agitation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: agitation.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
agitation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: agitation.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
const agitationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: agitation.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
agitationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: agitation.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/c3-problem'
*/
agitationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: agitation.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

agitation.form = agitationForm

const cycle3 = {
    agitation: Object.assign(agitation, agitation),
}

export default cycle3