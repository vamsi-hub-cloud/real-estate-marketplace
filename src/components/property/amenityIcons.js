import {
  ArrowUpDown, Building2, Car, Cpu, Dumbbell, Flame, PawPrint, Shirt, ShieldCheck, Sofa, Sun, Trees, Waves, Wifi, Wind, Zap, Check,
} from 'lucide-react'

export const amenityIcons = {
  Parking: Car,
  'Air Conditioning': Wind,
  Balcony: Sun,
  Garden: Trees,
  'Swimming Pool': Waves,
  Gym: Dumbbell,
  Security: ShieldCheck,
  Elevator: ArrowUpDown,
  'Pet Friendly': PawPrint,
  Fireplace: Flame,
  'Wi-Fi': Wifi,
  'Smart Home': Cpu,
  Furnished: Sofa,
  'Backup Power': Zap,
  Laundry: Shirt,
  'Rooftop Terrace': Building2,
}

export const iconFor = (name) => amenityIcons[name] || Check
