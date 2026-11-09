'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Input,
  Select,
  Textarea,
  FormField,
  ImageUpload,
} from '../../common/components';
import {
  Evidence,
  EvidenceType,
  EVIDENCE_TYPES,
  EvidenceTypeLabels,
  RelevanceDescriptions,
} from '../domain/evidence';
import { SuspectLookupOption } from '../services/suspects-lookup';
import { CreateEvidencePayload, UpdateEvidencePayload } from '../services/evidences.service';

export interface EvidenceFormModalProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  initialData?: Evidence | null;
  suspects: SuspectLookupOption[];
  onSubmit: (data: Omit<CreateEvidencePayload, 'caseId'> | UpdateEvidencePayload) => Promise<void>;
}

export const EvidenceFormModal: React.FC<EvidenceFormModalProps> = ({
  open,
  onClose,
  caseId: _caseId,
  initialData,
  suspects,
  onSubmit,
}) => {
  const isEditing = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<EvidenceType>('PHYSICAL');
  const [collectedAt, setCollectedAt] = useState('');
  const [relevance, setRelevance] = useState<number>(3);
  const [suspectId, setSuspectId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fecha máxima permitida (ahora mismo, formateada a YYYY-MM-DDTHH:mm)
  const maxDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setType(initialData.type);
      try {
        const d = new Date(initialData.collectedAt);
        // Formato para input datetime-local: YYYY-MM-DDTHH:mm en hora local
        const pad = (n: number) => n.toString().padStart(2, '0');
        const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate(),
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setCollectedAt(localIso);
      } catch {
        setCollectedAt('');
      }
      setRelevance(initialData.relevance);
      setSuspectId(initialData.suspectId || '');
      setImageUrl(initialData.imageUrl || null);
    } else {
      // Valores iniciales para creación
      setTitle('');
      setDescription('');
      setType('PHYSICAL');
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const currentLocal = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate(),
      )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setCollectedAt(currentLocal);
      setRelevance(3);
      setSuspectId('');
      setImageUrl(null);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'El título es obligatorio';
    } else if (title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    } else if (title.trim().length > 120) {
      newErrors.title = 'El título no puede exceder 120 caracteres';
    }

    if (!description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (description.trim().length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
    } else if (description.trim().length > 1000) {
      newErrors.description = 'La descripción no puede exceder 1000 caracteres';
    }

    if (!collectedAt) {
      newErrors.collectedAt = 'La fecha y hora de recolección es obligatoria';
    } else {
      const selected = new Date(collectedAt);
      if (isNaN(selected.getTime())) {
        newErrors.collectedAt = 'La fecha de recolección no es válida';
      } else if (selected.getTime() > Date.now() + 60000) {
        newErrors.collectedAt = 'La fecha de recolección no puede ser futura';
      }
    }

    if (relevance < 1 || relevance > 5) {
      newErrors.relevance = 'La relevancia debe estar entre 1 y 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const isoDate = new Date(collectedAt).toISOString();

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        type,
        collectedAt: isoDate,
        relevance: Number(relevance),
        suspectId: suspectId ? suspectId : null,
        imageUrl: imageUrl || null,
      });

      onClose();
    } catch (err: unknown) {
      setErrors({
        general:
          err instanceof Error ? err.message : 'Ocurrió un error al guardar la evidencia forense',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={isEditing ? 'ACTUALIZAR EVIDENCIA FORENSE' : 'FIJAR NUEVA EVIDENCIA AL EXPEDIENTE'}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 border border-evidencia bg-evidencia/10 text-evidencia font-mono text-xs">
            {errors.general}
          </div>
        )}

        <Input
          label="Título de la evidencia"
          placeholder="Ej: Casquillo 9mm percutido, Disco duro externo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Tipo de evidencia"
            value={type}
            onChange={(e) => setType(e.target.value as EvidenceType)}
            required
          >
            {EVIDENCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {EvidenceTypeLabels[t]}
              </option>
            ))}
          </Select>

          <Select
            label="Nivel de relevancia (1 a 5)"
            value={relevance}
            onChange={(e) => setRelevance(Number(e.target.value))}
            error={errors.relevance}
            required
          >
            {[1, 2, 3, 4, 5].map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl} &mdash; {RelevanceDescriptions[lvl]}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            label="Fecha y hora de recolección"
            value={collectedAt}
            max={maxDateTime}
            onChange={(e) => setCollectedAt(e.target.value)}
            error={errors.collectedAt}
            hint="No puede ser una fecha futura"
            required
          />

          <Select
            label="Sospechoso vinculado (opcional)"
            value={suspectId}
            onChange={(e) => setSuspectId(e.target.value)}
            hint="Asocie la evidencia a una persona de interés del caso"
          >
            <option value="">-- Ninguno / Sin vincular --</option>
            {suspects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} {s.alias ? `("${s.alias}")` : ''}
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Descripción pormenorizada del hallazgo"
          placeholder="Describa el estado, ubicación exacta en la escena y características del elemento probatorio..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          required
        />

        {/* Carga de Imagen Forense (ImageUpload de B) */}
        <FormField>
          <ImageUpload
            value={imageUrl || undefined}
            onChange={(url) => setImageUrl(url || null)}
            folder="evidences"
            label="Fotografía del elemento material probatorio"
          />
        </FormField>

        {/* Acciones del formulario */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-grafito-light">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            CANCELAR
          </Button>
          <Button variant="primary" type="submit" loading={isSubmitting}>
            {isEditing ? 'GUARDAR CAMBIOS' : 'REGISTRAR EVIDENCIA'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
