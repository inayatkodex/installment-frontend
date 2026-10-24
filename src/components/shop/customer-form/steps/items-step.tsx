import { Plus, Trash2 } from "lucide-react";
import CommonBtn from "@/components/common/CommonButton/Button";
import FormInput from "@/components/common/ui/FormInput";
import { formatRs, maskMoney, toNumber } from "@/shared/formatUtils";
import ItemPhoto from "./item-photo";
import { ItemRow, StepProps } from "../formTypes";

export const MAX_ITEMS = 4;

const ItemsStep = ({ form, errors, update }: StepProps) => {
  const setItem = (key: number, patch: Partial<ItemRow>) =>
    update({
      items: form.items.map((i) => (i.key === key ? { ...i, ...patch } : i)),
    });
  const total = form.items.reduce((a, i) => a + toNumber(i.price), 0);

  return (
    <>
      {form.items.map((i, idx) => (
        <div key={i.key} className="cf-card">
          <div className="cf-card-head">
            <strong>
              Item {idx + 1}{" "}
              <span className="ur" lang="ur">
                چیز {idx + 1}
              </span>
            </strong>
            {form.items.length > 1 && (
              <button
                type="button"
                className="cf-trash"
                onClick={() =>
                  update({ items: form.items.filter((x) => x.key !== i.key) })
                }
                aria-label={`Item ${idx + 1} hata dein`}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <div className="cf-fields">
            <FormInput
              label="Item name"
              labelUr="چیز کا نام"
              value={i.name}
              onChange={(e) => setItem(i.key, { name: e.target.value })}
              placeholder="Jaise: LED TV"
              error={errors[`n${i.key}`]}
            />
            <FormInput
              label="Price (Rs.)"
              labelUr="قیمت"
              inputMode="numeric"
              value={i.price}
              onChange={(e) =>
                setItem(i.key, { price: maskMoney(e.target.value) })
              }
              placeholder="0"
              error={errors[`p${i.key}`]}
            />
            <ItemPhoto
              itemName={i.name}
              file={i.photo}
              onChange={(f) => setItem(i.key, { photo: f })}
            />
          </div>
        </div>
      ))}

      {form.items.length < MAX_ITEMS && (
        <CommonBtn
          text="Aur item add karein"
          icon={<Plus size={20} />}
          className="outline-btn full-btn"
          onClick={() =>
            update({
              items: [...form.items, { key: Date.now(), name: "", price: "" }],
            })
          }
        />
      )}

      <div className="cf-total">
        <span>
          Total price{" "}
          <span className="ur" lang="ur">
            کل قیمت
          </span>
        </span>
        <strong>{formatRs(total)}</strong>
      </div>
    </>
  );
};

export default ItemsStep;
