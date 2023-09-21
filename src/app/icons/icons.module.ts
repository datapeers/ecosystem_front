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
  IconBulb,
  IconBoxMultiple,
  IconUsersGroup,
  IconUser,
  IconListSearch,
  IconListCheck,
  IconBuildingCommunity,
  IconSchool,
  IconInputSearch,
  IconWaveSquare,
  IconMapSearch,
  IconBook,
  IconDoorExit,
  IconChecklist,
  IconClockCode,
  IconChecks,
  IconChartDots,
  IconBellCode,
  IconEye,
  IconDownload,
  IconUpload,
  IconArrowLeft,
  IconArrowBackUp,
  IconBrandAsana,
  IconPlant,
  IconList,
  IconLayoutGrid,
  IconTree,
  IconTrees,
  IconApple,
  IconLeaf,
  IconPlant2,
  IconSeeding,
  IconAward,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconCornerDownRight,
  IconX,
  IconArrowBigLeft,
  IconArrowBigRight,
  IconBrandAdobe,
  IconDownloadOff,
  IconAffiliate, // affiliate
  IconDna2, // dna-2
  IconReplace, // replace
  IconApiApp, //api-app
  IconFileDescription, // file-description
  IconArrowBigRightLine, // arrow-big-right-line
} from 'angular-tabler-icons/icons';
import { environment } from 'src/environments/environment';
// Select some icons (use an object, not an array)
const icons = {
  IconMenu,
  IconMenu2,
  IconBell,
  IconCamera,
  IconChartDots,
  IconHeart,
  IconList,
  IconLayoutGrid,
  IconListCheck,
  IconBrandGithub,
  IconEye,
  IconDownload,
  IconUpload,
  IconSmartHome,
  IconStairsUp,
  IconLayoutBoardSplit,
  IconTools,
  IconRocket,
  IconCalendarEvent,
  IconClipboardCheck,
  IconCalendarTime,
  IconAward,
  IconHeartHandshake,
  IconSocial,
  IconBulb,
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
  IconChecks,
  IconBellCode,
  IconArrowLeft,
  IconArrowBackUp,
  IconBrandAsana,
  IconPlant,
  IconTree,
  IconTrees,
  IconApple,
  IconLeaf,
  IconPlant2,
  IconSeeding,
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconCornerDownRight,
  IconX,
  IconArrowBigLeft,
  IconArrowBigRight,
  IconBrandAdobe,
  IconDownloadOff,
  IconAffiliate,
  IconDna2,
  IconReplace,
  IconApiApp,
  IconFileDescription,
  IconArrowBigRightLine,
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
