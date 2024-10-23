<p align="center">
  <img src="frontend/vite-rallyrank/src/pages/RallyRankLogo.png" alt="RallyRank Logo" width="300"/>
</p>

## 🚀 Features

- **Player Profiles**: View detailed player profiles, including rankings, win-loss records, biggest wins, and rating history.
- **Dynamic Game History**: Searchable and sortable game history, allowing users to quickly find specific games.
- **Rating System**: Real-time player rating updates based on the results of games.
- **Responsive Design**: Fully optimized for mobile and desktop views, with a user-friendly interface.
- **Light/Dark Mode**: Toggle between light and dark themes for a personalized experience.

## 🛠️ Tech Stack

- **Frontend**: React, Mantine UI, TypeScript
- **Backend**: Flask, PostgreSQL (for database)
- **Charts**: Mantine Charts (built on Recharts)
- **Styling**: Custom theming using Mantine with `IBM Plex Mono` font for a clean and modern look.

## 📈 Rating Calculation
The player rating system in RallyRank is based on a dynamic rating adjustment method, which incorporates elements from Elo-like systems and adjusts ratings based on the margin of victory. The core idea is to adjust players’ ratings after each game depending on the outcome, the rating difference between the players, and the score difference in the game.

**Key Variables in the Formula**:

- **K (K-factor)**: A constant value used to scale the rating changes (set to 32 in this system).
- **Player Scores**: Represent the final score of each player in the game.
- **Player Ratings**: Represent the rating of the players before the game.
- **Expected Score**: This is the probability of each player winning based on their ratings, calculated using the rating difference.
- **Margin Multiplier**: This adjusts the rating change based on the score difference in the game.

**Formula Breakdown**:

1. Calculate the Result:
    - If Player 1 wins, `score1 = 1` and `score2 = 0`.
    - If Player 2 wins, `score1 = 0` and `score1 = 1`.
2. Calculate the Expected Scores:
    - The expected score is calculated using the rating difference between the players:
        ```
        expected_score1 = 1 / (1 + 10 ** (rating_diff / 400))
        expected_score2 = 1 - expected_score1
        ```
3. Score Difference Adjustment (Margin Multiplier):
    - The formula adjusts for the margin of victory using a margin multiplier:
        ```
        score_diff = abs(player1_score - player2_score)
        margin_multiplier = (score_diff + 1) / 20
        ```
4. Calculate the Rating Change:
    - The rating change for each player is computed as:
        ```
        rating_change_player1 = int(K * margin_multiplier * (score1 - expected_score1))
        rating_change_player2 = int(K * margin_multiplier * (score2 - expected_score2))
        ```

## 📄 License
MIT