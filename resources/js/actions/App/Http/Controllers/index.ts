import C11ScalevProofController from './C11ScalevProofController'
import AnalyticsController from './AnalyticsController'
import ScalevWebhookController from './ScalevWebhookController'
import LabsController from './LabsController'
import Settings from './Settings'
const Controllers = {
    C11ScalevProofController: Object.assign(C11ScalevProofController, C11ScalevProofController),
AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
ScalevWebhookController: Object.assign(ScalevWebhookController, ScalevWebhookController),
LabsController: Object.assign(LabsController, LabsController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers