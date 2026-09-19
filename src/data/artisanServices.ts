import ApplianceRepairArtwork from '../../assets/images/artisan-types/fridge-electronics-technician.svg';
import BakerArtwork from '../../assets/images/artisan-types/baker.svg';
import BarberArtwork from '../../assets/images/artisan-types/barber.svg';
import BeadMakerArtwork from '../../assets/images/artisan-types/bead-maker.svg';
import CarpenterArtwork from '../../assets/images/artisan-types/carpenter.svg';
import CarWashArtwork from '../../assets/images/artisan-types/car-wash-attendant.svg';
import CatererArtwork from '../../assets/images/artisan-types/caterer-svg.svg';
import CleanerArtwork from '../../assets/images/artisan-types/house-cleaner.svg';
import DispatchRiderArtwork from '../../assets/images/artisan-types/dispatch-rider.svg';
import ElectricianArtwork from '../../assets/images/artisan-types/electrician.svg';
import EventDecoratorArtwork from '../../assets/images/artisan-types/event-decorator.svg';
import GardenerArtwork from '../../assets/images/artisan-types/gardener.svg';
import GeneratorRepairArtwork from '../../assets/images/artisan-types/generator-repairman.svg';
import HairstylistArtwork from '../../assets/images/artisan-types/hairstylist.svg';
import InteriorDecoratorArtwork from '../../assets/images/artisan-types/interior-decorator.svg';
import MakeupArtistArtwork from '../../assets/images/artisan-types/makeup-artist.svg';
import MechanicArtwork from '../../assets/images/artisan-types/mechanic.svg';
import NailTechnicianArtwork from '../../assets/images/artisan-types/nail-technician.svg';
import NannyArtwork from '../../assets/images/artisan-types/nanny.svg';
import PainterArtwork from '../../assets/images/artisan-types/painter.svg';
import PestControlArtwork from '../../assets/images/artisan-types/pest-control-fumigator.svg';
import PhoneRepairArtwork from '../../assets/images/artisan-types/phonegadget-repairer.svg';
import PhotographerArtwork from '../../assets/images/artisan-types/photographer.svg';
import PlumberArtwork from '../../assets/images/artisan-types/plumber.svg';
import ShoeMakerArtwork from '../../assets/images/artisan-types/shoe-maker.svg';
import SpaTherapistArtwork from '../../assets/images/artisan-types/spa-therapistmasseuse.svg';
import TechCreativeArtwork from '../../assets/images/artisan-types/tech-creative.svg';
import VideographerArtwork from '../../assets/images/artisan-types/videographer.svg';
import WelderArtwork from '../../assets/images/artisan-types/welder.svg';

export const ARTISAN_SERVICES = [
  { id: 'carpentry', label: 'Carpenter', Artwork: CarpenterArtwork },
  { id: 'gardening', label: 'Gardener', Artwork: GardenerArtwork },
  { id: 'photography', label: 'Photographer', Artwork: PhotographerArtwork },
  { id: 'cleaning', label: 'Cleaner', Artwork: CleanerArtwork },
  { id: 'plumbing', label: 'Plumber', Artwork: PlumberArtwork },
  { id: 'electrical', label: 'Electrician', Artwork: ElectricianArtwork },
  { id: 'hair', label: 'Hairstylist', Artwork: HairstylistArtwork },
  { id: 'painting', label: 'Painter', Artwork: PainterArtwork },
  { id: 'mechanic', label: 'Mechanic', Artwork: MechanicArtwork },
  { id: 'barber', label: 'Barber', Artwork: BarberArtwork },
  { id: 'makeup', label: 'Makeup artist', Artwork: MakeupArtistArtwork },
  { id: 'nails', label: 'Nail technician', Artwork: NailTechnicianArtwork },
  { id: 'catering', label: 'Caterer', Artwork: CatererArtwork },
  { id: 'baking', label: 'Baker', Artwork: BakerArtwork },
  { id: 'welding', label: 'Welder', Artwork: WelderArtwork },
  { id: 'car-wash', label: 'Car wash', Artwork: CarWashArtwork },
  {
    id: 'interior-decoration',
    label: 'Interior decorator',
    Artwork: InteriorDecoratorArtwork,
  },
  { id: 'dispatch', label: 'Dispatch rider', Artwork: DispatchRiderArtwork },
  {
    id: 'electronics',
    label: 'Appliance repair',
    Artwork: ApplianceRepairArtwork,
  },
  { id: 'phone-repair', label: 'Phone repair', Artwork: PhoneRepairArtwork },
  {
    id: 'generator-repair',
    label: 'Generator repair',
    Artwork: GeneratorRepairArtwork,
  },
  { id: 'pest-control', label: 'Pest control', Artwork: PestControlArtwork },
  {
    id: 'event-decoration',
    label: 'Event decorator',
    Artwork: EventDecoratorArtwork,
  },
  { id: 'shoe-making', label: 'Shoemaker', Artwork: ShoeMakerArtwork },
  { id: 'bead-making', label: 'Bead maker', Artwork: BeadMakerArtwork },
  { id: 'spa', label: 'Spa therapist', Artwork: SpaTherapistArtwork },
  { id: 'videography', label: 'Videographer', Artwork: VideographerArtwork },
  { id: 'tech', label: 'Tech creative', Artwork: TechCreativeArtwork },
  { id: 'nanny', label: 'Nanny', Artwork: NannyArtwork },
] as const;
