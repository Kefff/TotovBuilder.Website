import imageCaliber from '../assets/images/caliber.webp'
import imageChop from '../assets/images/chop.webp'
import imageFence from '../assets/images/fence.webp'
import imageFirerate from '../assets/images/fire-rate.webp'
import imageFleamarket from '../assets/images/flea-market.webp'
import imageJaeger from '../assets/images/jaeger.webp'
import imageLanguageEn from '../assets/images/language-en.webp'
import imageLanguageFr from '../assets/images/language-fr.webp'
import imageMechanic from '../assets/images/mechanic.webp'
import imagePeacekeeper from '../assets/images/peacekeeper.webp'
import imagePistol from '../assets/images/pistol.webp'
import imagePraporAngry from '../assets/images/prapor-angry.webp'
import imagePraporSmiling from '../assets/images/prapor-smiling.webp'
import imagePrapor from '../assets/images/prapor.webp'
import imageRagman from '../assets/images/ragman.webp'
import imageRicochet from '../assets/images/ricochet.webp'
import imageRifle1 from '../assets/images/rifle1.webp'
import imageRifle2 from '../assets/images/rifle2.webp'
import imageSantaPraporSmiling from '../assets/images/santa-prapor-smiling.webp'
import imageSkier from '../assets/images/skier.webp'
import imageStab from '../assets/images/stab.webp'
import imageTherapist from '../assets/images/therapist.webp'

export interface IImages {
  [key: string]: string
}

const Images: IImages = {
  caliber: imageCaliber,
  chop: imageChop,
  fence: imageFence,
  fireRate: imageFirerate,
  fleaMarket: imageFleamarket,
  jaeger: imageJaeger,
  languageEn: imageLanguageEn,
  languageFr: imageLanguageFr,
  mechanic: imageMechanic,
  peacekeeper: imagePeacekeeper,
  pistol: imagePistol,
  praporAngry: imagePraporAngry,
  praporSmiling: imagePraporSmiling,
  prapor: imagePrapor,
  ragman: imageRagman,
  ricochet: imageRicochet,
  rifle1: imageRifle1,
  rifle2: imageRifle2,
  santaPraporSmiling: imageSantaPraporSmiling,
  skier: imageSkier,
  stab: imageStab,
  therapist: imageTherapist
}

export default Images