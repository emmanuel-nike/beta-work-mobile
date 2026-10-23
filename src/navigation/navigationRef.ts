import { createNavigationContainerRef } from '@react-navigation/native';

import type { AuthStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<AuthStackParamList>();
