import Team, { TeamModel } from '../model/Team';

async function findByName(name: string): Promise<Team | null> {
  return TeamModel.findOne({ name: name }).lean().exec();
}

async function findByValue(valueNumber: number): Promise<Team[]> {
  return TeamModel.find({
    value: { $bitsAnySet: valueNumber }
  }).lean();
}
export default {
  findByName,
  findByValue,
};
