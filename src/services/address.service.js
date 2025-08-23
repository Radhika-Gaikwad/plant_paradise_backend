class AddressService {
  constructor(User) {
    this.User = User;
  }

  async addAddress(userId, addressData) {
    try {
      const user = await this.User.findById(userId);
      if (!user) return { code: 404, message: "User not found" };

      user.address.push(addressData);
      await user.save();

      return { code: 201, message: "Address added successfully", address: user.address };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  }

async editAddress(userId, addressId, updateData) {
  try {
    const user = await this.User.findById(userId);
    if (!user) return { code: 404, message: "User not found" };

    // Find address by custom UUID "id" instead of MongoDB "_id"
    const address = user.address.find(addr => addr.id === addressId);
    if (!address) return { code: 404, message: "Address not found" };

    Object.assign(address, updateData);
    await user.save();

    return { code: 200, message: "Address updated successfully", address };
  } catch (err) {
    return { code: 500, message: err.message };
  }
}


async deleteAddress(userId, addressId) {
  try {
    const user = await this.User.findById(userId);
    if (!user) return { code: 404, message: "User not found" };

    const addressIndex = user.address.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) return { code: 404, message: "Address not found" };

    user.address.splice(addressIndex, 1);
    await user.save();

    return { code: 200, message: "Address deleted successfully", address: user.address };
  } catch (err) {
    return { code: 500, message: err.message };
  }
}


async getAddresses(userId) {
  try {
    const user = await this.User.findById(userId).select("address");
    if (!user) return { code: 404, message: "User not found" };

    return { code: 200, message: "Addresses fetched successfully", address: user.address };
  } catch (err) {
    return { code: 500, message: err.message };
  }
}


}

export default AddressService;
