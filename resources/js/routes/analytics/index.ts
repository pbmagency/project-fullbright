import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:42
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
 * @see app/Http/Controllers/AnalyticsController.php:42
 * @route '/analytics/track'
 */
track.url = (options?: RouteQueryOptions) => {
    return track.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:42
 * @route '/analytics/track'
 */
track.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:42
 * @route '/analytics/track'
 */
    const trackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: track.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:42
 * @route '/analytics/track'
 */
        trackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: track.url(options),
            method: 'post',
        })
    
    track.form = trackForm
/**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:85
 * @route '/analytics/track-batch'
 */
export const trackBatch = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trackBatch.url(options),
    method: 'post',
})

trackBatch.definition = {
    methods: ["post"],
    url: '/analytics/track-batch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:85
 * @route '/analytics/track-batch'
 */
trackBatch.url = (options?: RouteQueryOptions) => {
    return trackBatch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:85
 * @route '/analytics/track-batch'
 */
trackBatch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trackBatch.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:85
 * @route '/analytics/track-batch'
 */
    const trackBatchForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: trackBatch.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:85
 * @route '/analytics/track-batch'
 */
        trackBatchForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: trackBatch.url(options),
            method: 'post',
        })
    
    trackBatch.form = trackBatchForm
const analytics = {
    track: Object.assign(track, track),
trackBatch: Object.assign(trackBatch, trackBatch),
}

export default analytics