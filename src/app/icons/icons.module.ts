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
  IconBrandLinkedin,
  IconStairs,
  IconLayoutBoardSplit,
  IconTools,
  IconRocket,
  IconCalendarEvent,
  IconClock,
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
  IconAffiliate,
  IconDna2,
  IconReplace,
  IconApiApp,
  IconFileDescription,
  IconArrowBigRightLine,
  IconArrowBigLeftLine,
  IconArrowNarrowRight,
  IconArrowNarrowLeft,
  IconCalendarBolt,
  IconCalendarCode,
  IconSearch,
  IconExclamationCircle,
  IconFence,
  IconEdit,
  IconDeviceFloppy,
  IconCloudLockOpen,
  IconPlayerPlay,
  IconSolarPanel,
  IconMinimize,
  IconBrandUbuntu,
  IconPolygon,
  IconFlag3,
  IconForms,
  IconChartPie,
  IconStarsFilled,
  IconMailForward,
  IconUserCheck,
  IconUserBolt,
  IconUserCode,
  IconTrash,
  IconUserPlus
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
  IconBrandLinkedin,
  IconStairs,
  IconLayoutBoardSplit,
  IconTools,
  IconRocket,
  IconCalendarEvent,
  IconClock,
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
  IconArrowBigLeftLine,
  IconArrowNarrowRight,
  IconArrowNarrowLeft,
  IconCalendarBolt,
  IconCalendarCode,
  IconSearch,
  IconExclamationCircle,
  IconFence,
  IconEdit,
  IconDeviceFloppy,
  IconCloudLockOpen,
  IconPlayerPlay,
  IconSolarPanel,
  IconMinimize,
  IconBrandUbuntu,
  IconPolygon,
  IconFlag3,
  IconForms,
  IconChartPie,
  IconStarsFilled,
  IconMailForward,
  IconUserCheck,
  IconUserBolt,
  IconUserCode,
  IconTrash,
  IconUserPlus
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
