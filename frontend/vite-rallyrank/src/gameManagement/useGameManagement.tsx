import { useState, useEffect } from 'react';
import { addPlayer, removePlayer, reactivatePlayer, getPlayers, addGameResult } from '../services/api';
import { showNotification } from '@mantine/notifications';

