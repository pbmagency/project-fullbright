import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:29
* @route '/analytics/track'
*/
export const track = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

track.definition = {
    methods: ["post"],
    url: '/analytics/track',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:29
* @route '/analytics/track'
*/
track.url = (options?: RouteQueryOptions) => {
    return track.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:29
* @route '/analytics/track'
*/
track.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:29
* @route '/analytics/track'
*/
const trackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: track.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnalyticsController::track
* @see app/Http/Controllers/AnalyticsController.php:29
* @route '/analytics/track'
*/
trackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: track.url(options),
    method: 'post',
})

track.form = trackForm

const analytics = {
    track: Object.assign(track, track),
}

export default analytics