import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import DatePicker from "../components/ui/date-picker";
import { ComboBox } from "../components/ui/combobox";

const wydzialy = [
	{ value: "W1", label: "Wydział Mechaniczny (W1)" },
	{ value: "W2", label: "Wydział Elektrotechniki, Elektroniki, Informatyki i Automatyki (W2)" },
	{ value: "W3", label: "Wydział Chemiczny (W3)" },
	{ value: "W4", label: "Wydział Technologii Materiałowych i Wzornictwa Tekstyliów (W4)" },
	{ value: "W5", label: "Wydział Biotechnologii i Nauk o Żywności (W5)" },
	{ value: "W6", label: "Wydział Budownictwa, Architektury i Inżynierii Środowiska (W6)" },
	{ value: "W7", label: "Wydział Fizyki Technicznej, Informatyki i Matematyki Stosowanej (W7)" },
	{ value: "W8", label: "Wydział Organizacji i Zarządzania (W8)" },
	{ value: "W9", label: "Wydział Inżynierii Procesowej i Ochrony Środowiska (W9)" },
];
const roczniki = [
	{ value: "I1", label: "I stopień – rok 1" },
	{ value: "I2", label: "I stopień – rok 2" },
	{ value: "I3", label: "I stopień – rok 3" },
	{
		value: "I4",
		label: "I stopień – rok 4 (dla studiów inżynierskich – 7 semestrów)",
	},
	{ value: "II1", label: "II stopień – rok 1" },
	{ value: "II2", label: "II stopień – rok 2" },
];
const rozmiary = [
	{ value: "S", label: "S" },
	{ value: "M", label: "M" },
	{ value: "L", label: "L" },
	{ value: "XL", label: "XL" },
	{ value: "XXL", label: "XXL" },
];
const diety = [
	{ value: "mięsna", label: "mięsna" },
	{ value: "wegetariańska", label: "wegetariańska" },
	{ value: "wegańska", label: "wegańska" },
	{ value: "bezglutenowa", label: "bezglutenowa" },
];

interface FormState {
	imie: string;
	nazwisko: string;
	dataUrodzenia: Date | null;
	numerIndeksu: string;
	wydzial: string;
	rocznik: string;
	rozmiar: string;
	dieta: string;
	alergeny: string;
	uwagi: string;
	akceptacja: boolean;
}
interface FormErrors {
	[key: string]: string;
}

export default function RegistrationForm() {
	const [form, setForm] = useState<FormState>({
		imie: "",
		nazwisko: "",
		dataUrodzenia: null,
		numerIndeksu: "",
		wydzial: "",
		rocznik: "",
		rozmiar: "",
		dieta: "",
		alergeny: "",
		uwagi: "",
		akceptacja: false,
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);

	const validate = () => {
		const newErrors: FormErrors = {};
		if (!form.imie.trim()) newErrors.imie = "Imię jest wymagane";
		if (!form.nazwisko.trim()) newErrors.nazwisko = "Nazwisko jest wymagane";
		if (!form.dataUrodzenia) newErrors.dataUrodzenia = "Data urodzenia jest wymagana";
		if (!form.numerIndeksu.match(/^\d{6}$/)) newErrors.numerIndeksu = "Numer indeksu musi mieć dokładnie 6 cyfr";
		if (!form.wydzial) newErrors.wydzial = "Wydział jest wymagany";
		if (!form.rocznik) newErrors.rocznik = "Rocznik jest wymagany";
		if (!form.rozmiar) newErrors.rozmiar = "Rozmiar koszulki jest wymagany";
		if (!form.dieta) newErrors.dieta = "Rodzaj diety jest wymagany";
		if (!form.akceptacja) newErrors.akceptacja = "Musisz zaakceptować regulamin i RODO";
		return newErrors;
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
		const { name, value, type } = target;
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
		}));
		setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSuccess("");
		const validation = validate();
		if (Object.keys(validation).length > 0) {
			setErrors(validation);
			return;
		}
		setLoading(true);
		setTimeout(() => {
			setSuccess("Dziękujemy za zgłoszenie!");
			setForm({
				imie: "",
				nazwisko: "",
				dataUrodzenia: null,
				numerIndeksu: "",
				wydzial: "",
				rocznik: "",
				rozmiar: "",
				dieta: "",
				alergeny: "",
				uwagi: "",
				akceptacja: false,
			});
			setErrors({});
			setLoading(false);
		}, 1200);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-5 w-full max-w-lg mx-auto bg-black/70 neon-border rounded-2xl p-8 shadow-xl"
			noValidate
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
				<div>
					<Label htmlFor="imie" className="text-white mb-2">Imię</Label>
					<Input
						id="imie"
						name="imie"
						value={form.imie}
						onChange={handleChange}
						required
						maxLength={50}
						className="w-full rounded-md border border-cyan-400 bg-black/60 text-cyan-200 p-2 focus:ring-2 focus:ring-cyan-400"
						aria-invalid={!!errors.imie}
						aria-describedby="imie-error"
					/>
					{errors.imie && <p id="imie-error" className="text-xs text-red-500 mt-1">{errors.imie}</p>}
				</div>
				<div>
					<Label htmlFor="nazwisko" className="text-white mb-2">Nazwisko</Label>
					<Input
						id="nazwisko"
						name="nazwisko"
						value={form.nazwisko}
						onChange={handleChange}
						required
						maxLength={100}
						className="w-full rounded-md border border-cyan-400 bg-black/60 text-cyan-200 p-2 focus:ring-2 focus:ring-cyan-400"
						aria-invalid={!!errors.nazwisko}
						aria-describedby="nazwisko-error"
					/>
					{errors.nazwisko && <p id="nazwisko-error" className="text-xs text-red-500 mt-1">{errors.nazwisko}</p>}
				</div>
				<div className="md:col-span-2">
					<Label htmlFor="dataUrodzenia" className="text-white mb-2">Data urodzenia</Label>
					<DatePicker
						value={form.dataUrodzenia ?? undefined}
						onChange={(date) => {
							setForm((prev) => ({ ...prev, dataUrodzenia: date ?? null }));
							setErrors((prev) => ({ ...prev, dataUrodzenia: "" }));
						}}
					/>
					{errors.dataUrodzenia && <p className="text-xs text-red-500 mt-1">{errors.dataUrodzenia}</p>}
				</div>
				<div>
					<Label htmlFor="numerIndeksu" className="text-white mb-2">Numer indeksu</Label>
					<Input
						id="numerIndeksu"
						name="numerIndeksu"
						value={form.numerIndeksu}
						onChange={handleChange}
						required
						pattern="\d{6}"
						maxLength={6}
						minLength={6}
						className="w-full rounded-md border border-cyan-400 bg-black/60 text-cyan-200 p-2 focus:ring-2 focus:ring-cyan-400"
						aria-invalid={!!errors.numerIndeksu}
						aria-describedby="numerIndeksu-error"
					/>
					{errors.numerIndeksu && <p id="numerIndeksu-error" className="text-xs text-red-500 mt-1">{errors.numerIndeksu}</p>}
				</div>
				<div>
					<Label htmlFor="wydzial" className="text-white mb-2">Wydział</Label>
					<ComboBox
						options={wydzialy}
						value={form.wydzial}
						onChange={val => {
							setForm(prev => ({ ...prev, wydzial: val }));
							setErrors((prev) => ({ ...prev, wydzial: "" }));
						}}
						name="wydzial"
						label={undefined}
						placeholder="Wybierz wydział"
						required
						renderValue={(val) => val}
					/>
					{errors.wydzial && <p className="text-xs text-red-500 mt-1">{errors.wydzial}</p>}
				</div>
				<div>
					<Label htmlFor="rocznik" className="text-white mb-2">Rocznik</Label>
					<ComboBox
						options={roczniki}
						value={form.rocznik}
						onChange={val => {
							setForm(prev => ({ ...prev, rocznik: val }));
							setErrors((prev) => ({ ...prev, rocznik: "" }));
						}}
						name="rocznik"
						label={undefined}
						placeholder="Wybierz rocznik"
						required
					/>
					{errors.rocznik && <p id="rocznik-error" className="text-xs text-red-500 mt-1">{errors.rocznik}</p>}
				</div>
				<div>
					<Label htmlFor="rozmiar" className="text-white mb-2">Rozmiar koszulki</Label>
					<ComboBox
						options={rozmiary}
						value={form.rozmiar}
						onChange={val => {
							setForm(prev => ({ ...prev, rozmiar: val }));
							setErrors((prev) => ({ ...prev, rozmiar: "" }));
						}}
						name="rozmiar"
						label={undefined}
						placeholder="Wybierz rozmiar"
						required
					/>
					{errors.rozmiar && <p id="rozmiar-error" className="text-xs text-red-500 mt-1">{errors.rozmiar}</p>}
				</div>
				<div>
					<Label htmlFor="dieta" className="text-white mb-2">Rodzaj diety</Label>
					<ComboBox
						options={diety}
						value={form.dieta}
						onChange={val => {
							setForm(prev => ({ ...prev, dieta: val }));
							setErrors((prev) => ({ ...prev, dieta: "" }));
						}}
						name="dieta"
						label={undefined}
						placeholder="Wybierz dietę"
						required
					/>
					{errors.dieta && <p id="dieta-error" className="text-xs text-red-500 mt-1">{errors.dieta}</p>}
				</div>
				<div className="md:col-span-2">
					<Label htmlFor="alergeny" className="text-white mb-2">Alergeny</Label>
					<textarea
						id="alergeny"
						name="alergeny"
						value={form.alergeny}
						onChange={handleChange}
						maxLength={1000}
						className="w-full rounded-md border border-cyan-400 bg-black/60 text-cyan-200 p-2 focus:ring-2 focus:ring-cyan-400"
						rows={2}
						aria-describedby="alergeny-count"
					/>
					<div className="flex justify-end text-xs text-cyan-400" id="alergeny-count">
						{form.alergeny.length}/1000
					</div>
				</div>
				<div className="md:col-span-2">
					<Label htmlFor="uwagi" className="text-white mb-2">Uwagi</Label>
					<textarea
						id="uwagi"
						name="uwagi"
						value={form.uwagi}
						onChange={handleChange}
						maxLength={2000}
						className="w-full rounded-md border border-cyan-400 bg-black/60 text-cyan-200 p-2 focus:ring-2 focus:ring-cyan-400"
						rows={2}
						aria-describedby="uwagi-count"
					/>
					<div className="flex justify-end text-xs text-cyan-400" id="uwagi-count">
						{form.uwagi.length}/2000
					</div>
				</div>
			</div>
			<div className="flex items-center gap-3 mt-2">
				<Checkbox
					id="akceptacja"
					name="akceptacja"
					checked={form.akceptacja}
					onCheckedChange={(checked) => {
						setForm((prev) => ({ ...prev, akceptacja: !!checked }));
						setErrors((prev) => ({ ...prev, akceptacja: "" }));
					}}
					required
					aria-invalid={!!errors.akceptacja}
					aria-describedby="akceptacja-error"
					className="border-cyan-400 focus-visible:ring-cyan-400 focus-visible:border-cyan-400"
				/>
				<Label htmlFor="akceptacja" className="text-white mb-2">
					Akceptuję <a href="/regulamin.pdf" target="_blank" rel="noopener noreferrer" className="underline text-cyan-400">regulamin</a> i <a href="/rodo.pdf" target="_blank" rel="noopener noreferrer" className="underline text-cyan-400">RODO</a> (wymagane)
				</Label>
			</div>
			{errors.akceptacja && <p id="akceptacja-error" className="text-xs text-red-500 mt-1">{errors.akceptacja}</p>}
			<Button
				type="submit"
				className="mt-4 bg-cyan-400 text-black font-bold hover:bg-cyan-300 neon-border rounded-lg shadow-lg px-8 py-3 text-lg"
				disabled={loading}
			>
				{loading ? "Wysyłanie..." : "Wyślij zgłoszenie"}
			</Button>
			{success && <div className="text-green-400 text-center font-bold mt-2">{success}</div>}
		</form>
	);
}
