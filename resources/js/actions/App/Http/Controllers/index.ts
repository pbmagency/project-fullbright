import AnalyticsController from './AnalyticsController'
import LabsController from './LabsController'
import Settings from './Settings'
const Controllers = {
    AnalyticsController: Object.assign(AnalyticsController, AnalyticsController),
LabsController: Object.assign(LabsController, LabsController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers