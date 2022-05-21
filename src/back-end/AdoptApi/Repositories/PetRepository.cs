using AdoptApi.Database;
using AdoptApi.Models;
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
        return await _context.Pets.Include(nameof(User.Id)).Include(nameof(id)).SingleAsync(u => u.Id == id);
    }


public async Task<Pet> CreatePet(Pet pet)
{
    await _context.Pets.AddAsync(pet);
    await _context.SaveChangesAsync();
    return pet;
}

}