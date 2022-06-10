using AdoptApi.Database;
using AdoptApi.Enums;
using AdoptApi.Models;
using AdoptApi.Models.Dtos;
using AdoptApi.Requests;
using Microsoft.EntityFrameworkCore;

namespace AdoptApi.Repositories;

public class PetRepository
{
    private Context _context;

    public PetRepository(Context context)
    {
        _context = context;
    }

    public async Task<Pet> GetPetById(int id)
    {
        return await _context.Pets.Include(nameof(User.Id)).SingleAsync(u => u.Id == id);
    }

    public async Task<Pet> CreatePet(Pet pet)
    {
        await _context.Pets.AddAsync(pet);
        await _context.SaveChangesAsync();
        return pet;
    }

    public async Task<List<Need>> GetAvailableNeeds()
    {
        return await _context.Needs.Where(n => n.IsActive == true).ToListAsync();
    }

    public async Task<Pet> GetAvailablePet(int petId)
    {
        return await _context.Pets.Where(p => p.IsActive == true && p.Id == petId).SingleAsync();
    }

    public async Task<List<Pet>> GetRegisteredPets(int userId)
    {
        return await _context.Pets.Where(p => p.UserId == userId).OrderByDescending(p => p.Id).ToListAsync();
    }

    public async Task<List<Pet>?> GetSearchPets(SearchPetRequest search)
    {
        var filter = _context.Pets.Where(p => p.IsActive == true);
        if (search.Type != null)
        {
            filter = filter.Where(p => p.Type == search.Type);
        }
        if (search.Gender != null)
        {
            filter = filter.Where(p => p.Gender == search.Gender);
        }
        if (search.Size != null)
        {
            filter = filter.Where(p => p.Size == search.Size);
        }
        return await filter.ToListAsync();
    }
}