import type { ImageSourcePropType } from 'react-native';

// Pre-rasterized from the source SVGs by scripts/rasterize-service-artwork.js.
// These illustrations only ever render as small thumbnails, so bitmaps load far
// faster than rasterizing the detailed vectors on the UI thread. Metro resolves
// the matching @2x/@3x asset for the device from each base require.
const ApplianceRepairArtwork = require('../../assets/images/service-artwork/fridge-electronics-technician.png');
const BakerArtwork = require('../../assets/images/service-artwork/baker.png');
const BarberArtwork = require('../../assets/images/service-artwork/barber.png');
const BeadMakerArtwork = require('../../assets/images/service-artwork/bead-maker.png');
const CarpenterArtwork = require('../../assets/images/service-artwork/carpenter.png');
const CarWashArtwork = require('../../assets/images/service-artwork/car-wash-attendant.png');
const CatererArtwork = require('../../assets/images/service-artwork/caterer-svg.png');
const CleanerArtwork = require('../../assets/images/service-artwork/house-cleaner.png');
const DispatchRiderArtwork = require('../../assets/images/service-artwork/dispatch-rider.png');
const ElectricianArtwork = require('../../assets/images/service-artwork/electrician.png');
const EventDecoratorArtwork = require('../../assets/images/service-artwork/event-decorator.png');
const GardenerArtwork = require('../../assets/images/service-artwork/gardener.png');
const GeneratorRepairArtwork = require('../../assets/images/service-artwork/generator-repairman.png');
const HairstylistArtwork = require('../../assets/images/service-artwork/hairstylist.png');
const InteriorDecoratorArtwork = require('../../assets/images/service-artwork/interior-decorator.png');
const MakeupArtistArtwork = require('../../assets/images/service-artwork/makeup-artist.png');
const MechanicArtwork = require('../../assets/images/service-artwork/mechanic.png');
const NailTechnicianArtwork = require('../../assets/images/service-artwork/nail-technician.png');
const NannyArtwork = require('../../assets/images/service-artwork/nanny.png');
const PainterArtwork = require('../../assets/images/service-artwork/painter.png');
const PestControlArtwork = require('../../assets/images/service-artwork/pest-control-fumigator.png');
const PhoneRepairArtwork = require('../../assets/images/service-artwork/phonegadget-repairer.png');
const PhotographerArtwork = require('../../assets/images/service-artwork/photographer.png');
const PlumberArtwork = require('../../assets/images/service-artwork/plumber.png');
const ShoeMakerArtwork = require('../../assets/images/service-artwork/shoe-maker.png');
const SpaTherapistArtwork = require('../../assets/images/service-artwork/spa-therapistmasseuse.png');
const TechCreativeArtwork = require('../../assets/images/service-artwork/tech-creative.png');
const VideographerArtwork = require('../../assets/images/service-artwork/videographer.png');
const WelderArtwork = require('../../assets/images/service-artwork/welder.png');

type ServiceArtwork = ImageSourcePropType;

export const ARTISAN_SERVICES = [
  { id: 'carpentry', label: 'Carpenter', subtitle: 'Furniture and fittings', artwork: CarpenterArtwork },
  { id: 'gardening', label: 'Gardener', subtitle: 'Lawns and plants', artwork: GardenerArtwork },
  { id: 'photography', label: 'Photographer', subtitle: 'Events and portraits', artwork: PhotographerArtwork },
  { id: 'cleaning', label: 'Cleaner', subtitle: 'Home and office', artwork: CleanerArtwork },
  { id: 'plumbing', label: 'Plumber', subtitle: 'Leaks and fittings', artwork: PlumberArtwork },
  { id: 'electrical', label: 'Electrician', subtitle: 'Wiring and power', artwork: ElectricianArtwork },
  { id: 'hair', label: 'Hairstylist', subtitle: 'Cuts and styling', artwork: HairstylistArtwork },
  { id: 'painting', label: 'Painter', subtitle: 'Walls and finishes', artwork: PainterArtwork },
  { id: 'mechanic', label: 'Mechanic', subtitle: 'Cars and engines', artwork: MechanicArtwork },
  { id: 'barber', label: 'Barber', subtitle: 'Cuts and grooming', artwork: BarberArtwork },
  { id: 'makeup', label: 'Makeup artist', subtitle: 'Glam and bridal', artwork: MakeupArtistArtwork },
  { id: 'nails', label: 'Nail technician', subtitle: 'Manicures and sets', artwork: NailTechnicianArtwork },
  { id: 'catering', label: 'Caterer', subtitle: 'Meals and events', artwork: CatererArtwork },
  { id: 'baking', label: 'Baker', subtitle: 'Cakes and pastries', artwork: BakerArtwork },
  { id: 'welding', label: 'Welder', subtitle: 'Metal and gates', artwork: WelderArtwork },
  { id: 'car-wash', label: 'Car wash', subtitle: 'Wash and detailing', artwork: CarWashArtwork },
  {
    id: 'interior-decoration',
    label: 'Interior decorator',
    subtitle: 'Spaces and styling',
    artwork: InteriorDecoratorArtwork,
  },
  { id: 'dispatch', label: 'Dispatch rider', subtitle: 'Pickup and delivery', artwork: DispatchRiderArtwork },
  {
    id: 'electronics',
    label: 'Appliance repair',
    subtitle: 'Fridges and gadgets',
    artwork: ApplianceRepairArtwork,
  },
  { id: 'phone-repair', label: 'Phone repair', subtitle: 'Screens and devices', artwork: PhoneRepairArtwork },
  {
    id: 'generator-repair',
    label: 'Generator repair',
    subtitle: 'Power and servicing',
    artwork: GeneratorRepairArtwork,
  },
  { id: 'pest-control', label: 'Pest control', subtitle: 'Fumigation and pests', artwork: PestControlArtwork },
  {
    id: 'event-decoration',
    label: 'Event decorator',
    subtitle: 'Parties and venues',
    artwork: EventDecoratorArtwork,
  },
  { id: 'shoe-making', label: 'Shoemaker', subtitle: 'Shoes and repairs', artwork: ShoeMakerArtwork },
  { id: 'bead-making', label: 'Bead maker', subtitle: 'Beads and jewelry', artwork: BeadMakerArtwork },
  { id: 'spa', label: 'Spa therapist', subtitle: 'Massage and wellness', artwork: SpaTherapistArtwork },
  { id: 'videography', label: 'Videographer', subtitle: 'Films and coverage', artwork: VideographerArtwork },
  { id: 'tech', label: 'Tech creative', subtitle: 'Design and digital', artwork: TechCreativeArtwork },
  { id: 'nanny', label: 'Nanny', subtitle: 'Childcare and sitting', artwork: NannyArtwork },
] as const satisfies readonly {
  id: string;
  label: string;
  subtitle: string;
  artwork: ServiceArtwork;
}[];

export type ArtisanService = (typeof ARTISAN_SERVICES)[number];

export function findArtisanService(serviceId: string): ArtisanService | undefined {
  return ARTISAN_SERVICES.find(service => service.id === serviceId);
}

/** "Carpenters near you", leaving non-role labels such as "Pest control" as-is. */
export function serviceListTitle(label: string): string {
  if (/repair|control|wash|decoration|creative/i.test(label)) {
    return `${label} near you`;
  }
  const plural = label.endsWith('s') ? label : `${label}s`;
  return `${plural} near you`;
}

export function serviceSearchPlaceholder(label: string): string {
  const noun = serviceListTitle(label).replace(/ near you$/, '');
  return `Search ${noun.toLowerCase()}`;
}
