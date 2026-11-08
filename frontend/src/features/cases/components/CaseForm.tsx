'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Case, CaseStatus } from '../domain/case';
import { casesService } from '../services/cases.service';
import { normalizeApiFieldErrors, FieldErrors } from '../utils/error-formatter';
import { isApiError } from '../../common/domain/api-error';
import { Button, Input, Select, Textarea, FormField, ImageUpload } from '../../common/components';

export interface CaseFormProps {
  initialCase?: Case;
  isEditing?: boolean;
}

function toDatetimeLocalString(isoString?: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const CaseForm: React.FC<CaseFormProps> = ({ initialCase, isEditing = false }) => {
  const router = useRouter();

  const [title, setTitle] = useState(initialCase?.title || '');
  const [description, setDescription] = useState(initialCase?.description || '');
  const [location, setLocation] = useState(initialCase?.location || '');
  const [incidentDate, setIncidentDate] = useState(
    toDatetimeLocalString(initialCase?.incidentDate) ||
      toDatetimeLocalString(new Date().toISOString()),
  );
  const [status, setStatus] = useState<CaseStatus>(initialCase?.status || 'OPEN');
  const [imageUrl, setImageUrl] = useState<string | null>(initialCase?.imageUrl || null);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateClient = (): boolean => {
    const errors: FieldErrors = {};

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      errors.title = 'El título del caso es obligatorio';
    } else if (cleanTitle.length < 3) {
      errors.title = 'El título debe tener al menos 3 caracteres';
    } else if (cleanTitle.length > 120) {
      errors.title = 'El título no puede exceder 120 caracteres';
    }

    const cleanDesc = description.trim();
    if (!cleanDesc) {
      errors.description = 'La descripción es obligatoria';
    } else if (cleanDesc.length < 10) {
      errors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (cleanDesc.length > 2000) {
      errors.description = 'La descripción no puede exceder 2000 caracteres';
    }

    const cleanLocation = location.trim();
    if (!cleanLocation) {
      errors.location = 'La ubicación de los hechos es obligatoria';
    } else if (cleanLocation.length < 3) {
      errors.location = 'La ubicación debe tener al menos 3 caracteres';
    } else if (cleanLocation.length > 120) {
      errors.location = 'La ubicación no puede exceder 120 caracteres';
    }

    if (!incidentDate) {
      errors.incidentDate = 'La fecha y hora del incidente es obligatoria';
    } else {
      const parsedDate = new Date(incidentDate);
      if (isNaN(parsedDate.getTime())) {
        errors.incidentDate = 'La fecha proporcionada no es válida';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateClient()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isoIncidentDate = new Date(incidentDate).toISOString();

      if (isEditing && initialCase) {
        // En edición: si imageUrl está vacío o fue quitado, se envía null
        const savedCase = await casesService.update(initialCase.id, {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          incidentDate: isoIncidentDate,
          status,
          imageUrl: imageUrl || null,
        });
        router.push(`/cases/${savedCase.id}`);
      } else {
        // En creación: si imageUrl no existe, se omite el campo
        const payload: {
          title: string;
          description: string;
          location: string;
          incidentDate: string;
          status: CaseStatus;
          imageUrl?: string;
        } = {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          incidentDate: isoIncidentDate,
          status,
        };

        if (imageUrl) {
          payload.imageUrl = imageUrl;
        }

        const savedCase = await casesService.create(payload);
        router.push(`/cases/${savedCase.id}`);
      }
    } catch (err: unknown) {
      if (isApiError(err)) {
        const normalized = normalizeApiFieldErrors(err);
        setGeneralError(normalized.generalMessage);
        setFieldErrors(normalized.fieldErrors);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Error al guardar el expediente forense');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-grafito-light bg-grafito p-6 shadow-xl space-y-6"
    >
      {/* Mensaje de error general de la API */}
      {generalError && (
        <div
          role="alert"
          className="p-3 border border-evidencia bg-evidencia/10 text-papel text-xs font-mono space-y-1"
        >
          <p className="font-bold text-evidencia uppercase tracking-wider">[ERROR DE REGISTRO]</p>
          <p>{generalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título del caso */}
        <div className="md:col-span-2">
          <Input
            label="Título de la investigación criminal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={fieldErrors.title}
            hint="Identificador textual del caso (3 a 120 caracteres)"
            placeholder="Ej: Homicidio en sector industrial"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <Textarea
            label="Descripción y detalles preliminares"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={fieldErrors.description}
            hint="Detalle de los hechos, circunstancias e indicios iniciales (10 a 2000 caracteres)"
            placeholder="Describa minuciosamente la escena, hora aproximada, hallazgos..."
            rows={5}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Ubicación */}
        <div>
          <Input
            label="Lugar de los hechos"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={fieldErrors.location}
            hint="Dirección, sector o coordenadas (3 a 120 caracteres)"
            placeholder="Ej: Calle 45 # 12-34, Bodega 3"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Fecha y hora del incidente */}
        <div>
          <FormField>
            <label
              htmlFor="case-incident-date"
              className="block text-xs font-mono tracking-wider text-papel-dark uppercase mb-1"
            >
              Fecha y hora del incidente
            </label>
            <input
              id="case-incident-date"
              type="datetime-local"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              disabled={isSubmitting}
              required
              className="w-full px-3 py-2 bg-grafito-dark border border-grafito-light text-papel text-sm focus:outline-none focus:ring-1 focus:ring-alerta [color-scheme:dark]"
            />
            {fieldErrors.incidentDate ? (
              <p className="text-xs font-mono text-evidencia mt-1">{fieldErrors.incidentDate}</p>
            ) : (
              <p className="text-[11px] font-mono text-papel-muted mt-1">
                Momento exacto o estimado de los acontecimientos
              </p>
            )}
          </FormField>
        </div>

        {/* Estado del caso */}
        <div>
          <Select
            label="Estado del expediente"
            value={status}
            onChange={(e) => setStatus(e.target.value as CaseStatus)}
            disabled={isSubmitting}
          >
            <option value="OPEN">Abierto</option>
            <option value="IN_PROGRESS">En investigación</option>
            <option value="CLOSED">Cerrado</option>
          </Select>
        </div>

        {/* Subida de imagen a Supabase Storage */}
        <div className="md:col-span-2">
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            folder="cases"
            label="Fotografía del lugar / Escena del crimen"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-4 border-t border-grafito-light flex items-center justify-end gap-4">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
          CANCELAR
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEditing ? 'GUARDAR MODIFICACIONES' : 'REGISTRAR INVESTIGACIÓN'}
        </Button>
      </div>
    </form>
  );
};
