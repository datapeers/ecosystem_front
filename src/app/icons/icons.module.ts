import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablerIconsModule } from 'angular-tabler-icons';
import {
  IconMenu,
  IconMenu2,
  IconBell,
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconSmartHome,
  IconStairsUp,
  IconLayoutBoardSplit,
  IconTools,
  IconRocket,
  IconCalendarEvent,
  IconClipboardCheck,
  IconCalendarTime,
  IconHeartHandshake,
  IconSocial,
  IconFileStar,
  IconFileBarcode,
  IconChartBar,
  IconQrcode,
  IconAddressBook,
  IconAdjustments,
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconAppWindowFilled,
  IconArrowBarDown,
  IconArrowBarLeft,
  IconArrowBarRight,
  IconBookmark,
  IconWriting,
  IconSettings,
  IconCalendar,
  IconAlbum,
  IconBoxMultiple,
  IconUsersGroup,
  IconUser,
  IconListSearch,
  IconBuildingCommunity,
  IconSchool,
  IconInputSearch,
  IconWaveSquare,
  IconMapSearch,
  IconBook,
  IconDoorExit,
  IconChecklist,
  IconClockCode,
} from 'angular-tabler-icons/icons';
import { environment } from 'src/environments/environment';

// Select some icons (use an object, not an array)
const icons = {
  IconMenu,
  IconMenu2,
  IconBell,
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconSmartHome,
  IconStairsUp,
  IconLayoutBoardSplit,
  IconTools,
  IconRocket,
  IconCalendarEvent,
  IconClipboardCheck,
  IconCalendarTime,
  IconHeartHandshake,
  IconSocial,
  IconFileStar,
  IconFileBarcode,
  IconChartBar,
  IconQrcode,
  IconAddressBook,
  IconAdjustments,
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
  IconAppWindowFilled,
  IconArrowBarDown,
  IconArrowBarLeft,
  IconArrowBarRight,
  IconBookmark,
  IconWriting,
  IconSettings,
  IconCalendar,
  IconAlbum,
  IconBoxMultiple,
  IconUsersGroup,
  IconUser,
  IconListSearch,
  IconBuildingCommunity,
  IconSchool,
  IconInputSearch,
  IconWaveSquare,
  IconMapSearch,
  IconBook,
  IconDoorExit,
  IconChecklist,
  IconClockCode,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TablerIconsModule.pick(icons, { ignoreWarnings: environment.production }),
  ],
  exports: [TablerIconsModule],
})
export class IconsModule {}
