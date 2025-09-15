
export default function UnitDto(unit) {
    return {
        id: unit._id,
        name: unit.name,
        category: unit.category
    };
}
