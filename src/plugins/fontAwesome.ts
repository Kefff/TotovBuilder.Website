import { library } from '@fortawesome/fontawesome-svg-core'
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faAngleDown,
  faAngleRight,
  faArrowLeft,
  faArrowRight,
  faArrowsAlt,
  faArrowsAltH,
  faArrowsAltV,
  faAward,
  faBalanceScale,
  faBan,
  faBars,
  faBell,
  faBolt,
  faBoxOpen,
  faBug,
  faBullseye,
  faCheck,
  faClipboardList,
  faCog,
  faCoins,
  faCompass,
  faCopy,
  faDollarSign,
  faDotCircle,
  faDownload,
  faEdit,
  faEllipsisH,
  faEnvelope,
  faEuroSign,
  faExclamationCircle,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFile,
  faFileUpload,
  faFilter,
  faFire,
  faFolderMinus,
  faFolderPlus,
  faFont,
  faGlasses,
  faGlobe,
  faHandPaper,
  faHatCowboy,
  faHeadphones,
  faHeart,
  faHeartBroken,
  faIdCardAlt,
  faInfoCircle,
  faLanguage,
  faList,
  faLock,
  faLowVision,
  faMask,
  faMinusSquare,
  faPlus,
  faPlusSquare,
  faPuzzlePiece,
  faRubleSign,
  faSave,
  faSearch,
  faSearchPlus,
  faShareAlt,
  faShieldAlt,
  faShieldVirus,
  faShoppingBasket,
  faShoppingCart,
  faSkull,
  faSortAmountDownAlt,
  faSortAmountUp,
  faStopwatch,
  faSuitcase,
  faSwatchbook,
  faSyncAlt,
  faTablets,
  faThLarge,
  faTimes,
  faTint,
  faTrash,
  faTv,
  faUndo,
  faUserTag,
  faVest,
  faViruses,
  faWalking,
  faWallet,
  faWeightHanging,
  faWind
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { App } from 'vue'

export function useFontAwesome(app: App<Element>): void {
  library.add(
    faAngleDown,
    faAngleRight,
    faArrowLeft,
    faArrowRight,
    faArrowsAlt,
    faArrowsAltH,
    faArrowsAltV,
    faAward,
    faBalanceScale,
    faBan,
    faBars,
    faBell,
    faBolt,
    faBoxOpen,
    faBug,
    faBullseye,
    faCheck,
    faClipboardList,
    faCog,
    faCoins,
    faCompass,
    faCopy,
    faDiscord,
    faDollarSign,
    faDotCircle,
    faDownload,
    faEdit,
    faEllipsisH,
    faEnvelope,
    faEuroSign,
    faExclamationCircle,
    faExclamationTriangle,
    faEye,
    faEyeSlash,
    faFile,
    faFileUpload,
    faFilter,
    faFire,
    faFolderMinus,
    faFolderPlus,
    faFont,
    faGithub,
    faGlasses,
    faGlobe,
    faHandPaper,
    faHatCowboy,
    faHeadphones,
    faHeart,
    faHeartBroken,
    faIdCardAlt,
    faInfoCircle,
    faInfoCircle,
    faLanguage,
    faList,
    faLock,
    faLowVision,
    faMask,
    faMinusSquare,
    faPlus,
    faPlusSquare,
    faPuzzlePiece,
    faRubleSign,
    faSave,
    faSearch,
    faSearchPlus,
    faShareAlt,
    faShieldAlt,
    faShieldVirus,
    faShoppingBasket,
    faShoppingCart,
    faSkull,
    faSortAmountDownAlt,
    faSortAmountUp,
    faStopwatch,
    faSuitcase,
    faSwatchbook,
    faSyncAlt,
    faTablets,
    faThLarge,
    faTimes,
    faTint,
    faTrash,
    faTv,
    faUndo,
    faUserTag,
    faVest,
    faViruses,
    faWalking,
    faWallet,
    faWeightHanging,
    faWind
  )
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}