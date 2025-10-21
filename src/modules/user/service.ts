import * as userRepository from './repository';

export const getAll = async () => {
  return userRepository.findAll();
};

export const getOne = async (userId: number) => {
  return userRepository.findById(userId);
};

export const search = async (query: string) => {
  return userRepository.findByQuery(query);
};
