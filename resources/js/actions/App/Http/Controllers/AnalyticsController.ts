import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:41
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
 * @see app/Http/Controllers/AnalyticsController.php:41
 * @route '/analytics/track'
 */
track.url = (options?: RouteQueryOptions) => {
    return track.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:41
 * @route '/analytics/track'
 */
track.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:41
 * @route '/analytics/track'
 */
    const trackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: track.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::track
 * @see app/Http/Controllers/AnalyticsController.php:41
 * @route '/analytics/track'
 */
        trackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: track.url(options),
            method: 'post',
        })
    
    track.form = trackForm
/**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:84
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
 * @see app/Http/Controllers/AnalyticsController.php:84
 * @route '/analytics/track-batch'
 */
trackBatch.url = (options?: RouteQueryOptions) => {
    return trackBatch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:84
 * @route '/analytics/track-batch'
 */
trackBatch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: trackBatch.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:84
 * @route '/analytics/track-batch'
 */
    const trackBatchForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: trackBatch.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::trackBatch
 * @see app/Http/Controllers/AnalyticsController.php:84
 * @route '/analytics/track-batch'
 */
        trackBatchForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: trackBatch.url(options),
            method: 'post',
        })
    
    trackBatch.form = trackBatchForm
/**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalyticsController::index
 * @see app/Http/Controllers/AnalyticsController.php:22
 * @route '/admin'
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
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/admin/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AnalyticsController::exportMethod
 * @see app/Http/Controllers/AnalyticsController.php:167
 * @route '/admin/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const AnalyticsController = { track, trackBatch, index, exportMethod, export: exportMethod }

export default AnalyticsController