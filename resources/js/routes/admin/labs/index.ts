import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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

const labs = {
    clearCache: Object.assign(clearCache, clearCache),
}

export default labs