import TwitchApi from "../services/TwitchApi";
import { createEntity } from "./helpers";

const gamesDictionary = createEntity('gamesDictionary', {} as Record<string, string>);

export const getGameName = async (id: string): Promise<string> => {
  const dict = gamesDictionary.get();
  if (dict[id]) {
    return dict[id];
  }

  const game = await TwitchApi.getGame(id);

  if (game) {
    gamesDictionary.set(d => ({ ...d, [id]: game.name }));
    return game.name;
  }

  return '';
};
