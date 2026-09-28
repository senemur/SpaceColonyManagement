using Business.Abstract;
using DataAccess.Contexts;
using Entities.Buildings;
using Entities.Colonies;
using Entities.Colonists;
using Entities.Resources;

namespace Business.Concrete
{
    public class ColonyService : IColonyService
    {
        private readonly SpaceColonyDbContext _context;

        public ColonyService(SpaceColonyDbContext context)
        {
            _context = context;
        }

        public async Task<Colony> CreateColonyAsync(int userId, string colonyName)
        {
            Colony colony = new Colony
            {
                Name = colonyName,
                Planet = "Mars",
                CreatedAt = DateTime.UtcNow,
                LastActiveAt = DateTime.UtcNow,
                ResourceCapacity = 500,
                UserId = userId,
            };

            colony.Resources = new List<ColonyResource>
            {
                new ColonyResource { Type = ResourceType.Food, Amount = 100 },
                new ColonyResource { Type = ResourceType.Water, Amount = 100 },
                new ColonyResource { Type = ResourceType.Oxygen, Amount = 100 },
                new ColonyResource { Type = ResourceType.Energy, Amount = 100 },
                new ColonyResource { Type = ResourceType.Iron, Amount = 100 },
            };

            colony.Buildings = new List<Building>
            {
                new Building
                {
                    Type = BuildingType.Warehouse,
                    Level = 1,
                    WorkerCount = 0,
                },
                new Building
                {
                    Type = BuildingType.Farm,
                    Level = 1,
                    WorkerCount = 2,
                },
                new Building
                {
                    Type = BuildingType.WaterExtractor,
                    Level = 1,
                    WorkerCount = 2,
                },
                new Building
                {
                    Type = BuildingType.OxygenGenerator,
                    Level = 1,
                    WorkerCount = 2,
                },
                new Building
                {
                    Type = BuildingType.SolarPanel,
                    Level = 1,
                    WorkerCount = 0,
                },
                new Building
                {
                    Type = BuildingType.IronMine,
                    Level = 1,
                    WorkerCount = 4,
                },
            };

            colony.Colonists = CreateStartingColonists();
            _context.Colonies.Add(colony);
            await _context.SaveChangesAsync();
            return colony;
        }

        private List<Colonist> CreateStartingColonists()
        {
            return new List<Colonist>
            {
                new Colonist
                {
                    Name = "Johny Deep",
                    Age = 28,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Jane Smith",
                    Age = 31,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Mike Johnson",
                    Age = 26,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Emily Davis",
                    Age = 34,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Chris Brown",
                    Age = 29,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Tom Holland",
                    Age = 25,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Henry Cavill",
                    Age = 30,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Leonardo DiCaprio",
                    Age = 27,
                    Health = 100,
                    Happiness = 80,
                },
                new Colonist
                {
                    Name = "Zendaya",
                    Age = 35,
                    Health = 100,
                    Happiness = 80,
                },
            };
        }
    }
}
