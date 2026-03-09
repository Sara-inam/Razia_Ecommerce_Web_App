"use client";
import ImageUpload from "./ImageUpload";

export default function ColorSection({ colors, setColors }) {

  const addColor = () => {
    setColors([
      ...colors,
      { name: "", hex: "", images: [], stock: [] }
    ]);
  };

  const updateColor = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };

  const addImage = (index, url) => {
    const updated = [...colors];
    updated[index].images.push(url);
    setColors(updated);
  };

  const addStock = (index) => {
    const updated = [...colors];
    updated[index].stock.push({ size: "", quantity: 0 });
    setColors(updated);
  };

  return (
    <div>
      <h3>Colors</h3>

      {colors.map((color, i) => (
        <div key={i} style={{ border: "1px solid gray", margin: 10 }}>

          <input
            placeholder="Color Name"
            value={color.name}
            onChange={(e) => updateColor(i, "name", e.target.value)}
          />

          <input
            placeholder="Hex"
            value={color.hex}
            onChange={(e) => updateColor(i, "hex", e.target.value)}
          />

          <ImageUpload onUpload={(url) => addImage(i, url)} />

          {color.images.map((img, idx) => (
            <img key={idx} src={img} width={50} />
          ))}

          <button type="button" onClick={() => addStock(i)}>
            Add Size
          </button>

          {color.stock.map((s, si) => (
            <div key={si}>
              <input
                placeholder="Size"
                onChange={(e) => {
                  const updated = [...colors];
                  updated[i].stock[si].size = e.target.value;
                  setColors(updated);
                }}
              />
              <input
                type="number"
                placeholder="Qty"
                onChange={(e) => {
                  const updated = [...colors];
                  updated[i].stock[si].quantity = e.target.value;
                  setColors(updated);
                }}
              />
            </div>
          ))}
        </div>
      ))}

      <button type="button" onClick={addColor}>
        Add Color
      </button>
    </div>
  );
}