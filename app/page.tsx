"use client";

import { useState, useRef, FormEvent } from "react";
import SignaturePad from "@/components/SignaturePad";

export default function KYCPage() {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file for the photo.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Photo must be under 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!photo) {
      setError("A photo is required.");
      return;
    }
    if (!signature) {
      setError("A signature is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          dob,
          address,
          phone,
          country,
          city,
          nextOfKin,
          photo,
          signature,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setSuccess(true);
      // Reset form
      setFullName("");
      setDob("");
      setAddress("");
      setPhone("");
      setCountry("");
      setCity("");
      setNextOfKin("");
      setPhoto(null);
      setSignature(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <div className="floral-corner top-left" />
        <div className="card">
          <div className="alert alert-success">
            Your KYC details have been submitted successfully. Thank you.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setSuccess(false)}
            style={{ width: "100%" }}
          >
            Submit another
          </button>
        </div>
        <p className="footer-note">TenorCrest · Secure identity verification</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="floral-corner top-left" />
      <div className="floral-corner bottom-right" />

      <div className="card">
        <h1>Identity Verification</h1>
        <p className="subtitle">
          Please complete the form below. Photo and signature are required.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Full name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="As on official ID"
              autoComplete="name"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>
                Date of birth <span className="required">*</span>
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Phone number <span className="required">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+1 234 567 8900"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Address <span className="required">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Street address"
              autoComplete="street-address"
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>
                City <span className="required">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                autoComplete="address-level2"
              />
            </div>
            <div className="form-group">
              <label>
                Country <span className="required">*</span>
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoComplete="country-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Next of kin <span className="required">*</span>
            </label>
            <input
              type="text"
              value={nextOfKin}
              onChange={(e) => setNextOfKin(e.target.value)}
              required
              placeholder="Full name of next of kin"
            />
          </div>

          <div className="form-group">
            <label>
              Photo <span className="required">*</span>
            </label>
            <div className="photo-area">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhoto}
                required={!photo}
              />
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="Preview" className="photo-preview" />
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              Signature <span className="required">*</span>
            </label>
            <div className="signature-area">
              <SignaturePad onChange={setSignature} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {loading ? "Submitting…" : "Submit verification"}
          </button>
        </form>
      </div>

      <p className="footer-note">TenorCrest · Secure identity verification</p>
    </div>
  );
}
