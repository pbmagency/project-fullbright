import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/labs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LabsController::index
* @see app/Http/Controllers/LabsController.php:15
* @route '/admin/labs'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\LabsController::clearCache
* @see app/Http/Controllers/LabsController.php:80
* @route '/admin/labs/clear-cache'
*/
export const clearCache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(options),
    method: 'post',
})

clearCache.definition = {
    methods: ["post"],
    url: '/admin/labs/clear-cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LabsController::clearCache
* @see app/Http/Controllers/LabsController.php:80
* @route '/admin/labs/clear-cache'
*/
clearCache.url = (options?: RouteQueryOptions) => {
    return clearCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LabsController::clearCache
* @see app/Http/Controllers/LabsController.php:80
* @route '/admin/labs/clear-cache'
*/
clearCache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCache.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabsController::clearCache
* @see app/Http/Controllers/LabsController.php:80
* @route '/admin/labs/clear-cache'
*/
const clearCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearCache.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LabsController::clearCache
* @see app/Http/Controllers/LabsController.php:80
* @route '/admin/labs/clear-cache'
*/
clearCacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clearCache.url(options),
    method: 'post',
})

clearCache.form = clearCacheForm

const LabsController = { index, clearCache }

export default LabsController