export interface Game {
    id: number;
    player1_name: string;
    player2_name: string;
    player1_score: number;
    player2_score: number;
    result: string;
    timestamp: string;
    new_rating_player1: number;
    new_rating_player2: number;
    prior_rating_player1: number;
    prior_rating_player2: number;
    rating_change_player1: number;
    rating_change_player2: number;
  }
  
  export interface Player {
    id: number;
    name: string;
    rating: number;
    is_active: boolean;
  }