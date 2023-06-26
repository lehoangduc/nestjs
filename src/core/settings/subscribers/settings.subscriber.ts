import { DataSource, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm'

import { Setting } from '../entities'
import { SettingsCacheService } from '../services'

@EventSubscriber()
export class SettingsSubscriber implements EntitySubscriberInterface<Setting> {
  constructor(dataSource: DataSource, private readonly settingsCacheService: SettingsCacheService) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Setting
  }

  afterUpdate(event: UpdateEvent<Setting>) {
    return this.settingsCacheService.updateSetting(event.entity as Setting)
  }
}
