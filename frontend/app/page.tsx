'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderArchive,
  Users,
  FileSearch,
  ShieldCheck,
  Lock,
  ArrowRight,
  Database,
  Camera,
  FileBadge2,
} from 'lucide-react';
import { useAuth } from '../src/features/auth';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Fondo con textura sutil de expediente forense */}
      <div
        className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* ===================================================================
          1. HERO SECTION: PORTADA DEL EXPEDIENTE FORENSE NOIR
         =================================================================== */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-grafito-light/80 bg-gradient-to-b from-grafito-dark via-tinta to-grafito-dark/60">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Sello de Clasificación */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-grafito border border-grafito-light font-mono text-[11px] text-alerta uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-alerta animate-pulse" />
              <span>SISTEMA DE INVESTIGACIÓN CRIMINAL &bull; PARADIGMAS & WEB 2026-2</span>
            </div>

            <div className="stamp-confidential select-none text-xs">
              CONFIDENCIAL // USO RESTRINGIDO
            </div>
          </div>

          {/* Título de la Plataforma */}
          <div className="space-y-4">
            <span className="block font-mono text-xs sm:text-sm text-alerta tracking-widest uppercase">
              DIVISIÓN DE INTELIGENCIA Y POLICÍA JUDICIAL FICTICIA
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-papel leading-tight tracking-wide">
              Gestión Centralizada de Expedientes Criminales y Fijación Forense
            </h1>
            <p className="max-w-3xl text-sm sm:text-base text-papel-dark font-sans leading-relaxed">
              Plataforma tecnológica orientada a la investigación pericial, trazabilidad de personas
              de interés, custodia de evidencias materiales con registro fotográfico y análisis
              exhaustivo de escenas del crimen. Diseñada bajo la estética de expediente forense
              noir.
            </p>
          </div>

          {/* Llamadas a la Acción (CTA) dinámicas según estado de sesión */}
          <div className="pt-2">
            {isAuthenticated ? (
              <div className="p-5 border border-grafito-light bg-grafito shadow-xl space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-grafito-light">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-alerta" />
                    <span className="font-mono text-xs text-alerta uppercase tracking-wider">
                      SESIÓN FORENSE ACTIVA
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-papel-muted">
                    {user?.role === 'ADMIN' ? 'COMISARIO / ADMIN' : 'DETECTIVE / INVESTIGADOR'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-papel">{user?.name}</p>
                    <p className="text-xs font-mono text-papel-muted">{user?.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <Link
                      href="/cases"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-evidencia hover:bg-evidencia-hover text-white font-mono text-xs uppercase tracking-wider shadow transition-colors"
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span>IR A EXPEDIENTES</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-grafito-light hover:bg-papel hover:text-tinta text-papel font-mono text-xs uppercase tracking-wider border border-grafito-light transition-colors"
                      >
                        <Users className="w-4 h-4 text-alerta" />
                        <span>ADMINISTRACIÓN</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-evidencia hover:bg-evidencia-hover text-white font-mono text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>INICIAR SESIÓN PERICIAL</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-grafito border border-grafito-light hover:bg-grafito-light text-papel font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors"
                >
                  <FileBadge2 className="w-4 h-4 text-alerta" />
                  <span>REGISTRAR NUEVO DETECTIVE</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. SECCIÓN: PILARES DE LA INVESTIGACIÓN (QUÉ SE PUEDE HACER)
         =================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-mono text-xs text-alerta uppercase tracking-widest">
            OPERACIONES PERICIALES INTEGRADAS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-papel">
            Arquitectura de Cadena de Custodia
          </h2>
          <p className="text-xs sm:text-sm text-papel-dark font-sans leading-relaxed">
            Todas las acciones procesales se coordinan a través de tres pilares delictivos y
            forenses rigurosamente estructurados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1: Casos Criminales */}
          <div className="border border-grafito-light bg-grafito p-6 shadow-md hover:border-alerta/50 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-grafito-dark border border-grafito-light flex items-center justify-center text-alerta">
                <FolderArchive className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-alerta tracking-widest uppercase">
                RECURSO I
              </span>
              <h3 className="font-serif text-lg text-papel">Expedientes y Casos</h3>
              <p className="text-xs text-papel-dark font-sans leading-relaxed">
                Registro cronológico con numeración formal (CR-0001), fijación fotográfica de la
                escena del crimen, ubicación geoespacial y gestión del estado procesal (Abierto, En
                Proceso, Cerrado).
              </p>
            </div>
            <ul className="pt-3 border-t border-grafito-light/60 font-mono text-[11px] text-papel-muted space-y-1">
              <li>&bull; Aislamiento por agente investigador</li>
              <li>&bull; Bloqueo de evidencias al cerrar caso</li>
              <li>&bull; Desactivación lógica y en cascada</li>
            </ul>
          </div>

          {/* Pilar 2: Sospechosos */}
          <div className="border border-grafito-light bg-grafito p-6 shadow-md hover:border-alerta/50 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-grafito-dark border border-grafito-light flex items-center justify-center text-alerta">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-alerta tracking-widest uppercase">
                RECURSO II
              </span>
              <h3 className="font-serif text-lg text-papel">Personas de Interés</h3>
              <p className="text-xs text-papel-dark font-sans leading-relaxed">
                Fichaje de personas de interés y sospechosos con alias delictivo, descripción de
                rasgos fisonómicos, asignación cuantitativa de nivel de sospecha (0-100) y registro
                fotográfico.
              </p>
            </div>
            <ul className="pt-3 border-t border-grafito-light/60 font-mono text-[11px] text-papel-muted space-y-1">
              <li>&bull; Estado: Investigado, Detenido, Exonerado</li>
              <li>&bull; Vinculación con indicios probatorios</li>
              <li>&bull; Desvinculación automática al archivarse</li>
            </ul>
          </div>

          {/* Pilar 3: Evidencias con Imagen */}
          <div className="border border-grafito-light bg-grafito p-6 shadow-md hover:border-alerta/50 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 bg-grafito-dark border border-grafito-light flex items-center justify-center text-alerta">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="font-mono text-[10px] text-alerta tracking-widest uppercase">
                RECURSO III &bull; REBANADA D
              </span>
              <h3 className="font-serif text-lg text-papel">Evidencias y Peritaje</h3>
              <p className="text-xs text-papel-dark font-sans leading-relaxed">
                Incorporación de elementos materiales probatorios tipificados (Física, Digital,
                Documento, Testimonio, Forense), escala pericial de relevancia (1 a 5) y subida
                segura de imágenes a almacenamiento en la nube.
              </p>
            </div>
            <ul className="pt-3 border-t border-grafito-light/60 font-mono text-[11px] text-papel-muted space-y-1">
              <li>&bull; Validación estricta de fecha no futura</li>
              <li>&bull; Asociación a sospechosos del mismo caso</li>
              <li>&bull; Consulta en cadena de custodia activa</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. SECCIÓN: CONTEXTO DEL PROYECTO Y DESTINATARIOS (PARA QUIÉN ES)
         =================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-grafito-dark/70 border-t border-b border-grafito-light/80">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="font-mono text-xs text-alerta uppercase tracking-widest">
              OBJETIVO Y DESTINATARIOS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-papel leading-snug">
              Diseñado para el Análisis Criminalístico Académico y Paradigmas de Software
            </h2>
            <p className="text-xs sm:text-sm text-papel-dark font-sans leading-relaxed">
              Esta aplicación fue concebida como solución integral para la asignatura de Desarrollo
              Web Full-Stack y Paradigmas de Programación (semestre 2026-2). Proporciona a docentes,
              estudiantes y evaluadores un entorno inmersivo para simular investigaciones criminales
              ficticias bajo normas de ingeniería de software de nivel industrial.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 font-mono text-xs text-papel-muted">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-alerta" />
                <span>PostgreSQL + Prisma ORM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-evidencia" />
                <span>Supabase Object Storage</span>
              </div>
            </div>
          </div>

          <div className="border border-grafito-light bg-grafito p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-grafito-light pb-2">
              <span className="font-mono text-xs text-alerta uppercase tracking-wider">
                NORMAS DEL PROTOCOLO DE CUSTODIA
              </span>
              <span className="font-mono text-[10px] text-papel-muted">REF: 2026-2</span>
            </div>
            <ul className="space-y-2.5 font-sans text-xs text-papel-dark">
              <li className="flex items-start gap-2">
                <span className="font-mono text-alerta font-bold">1.</span>
                <span>
                  <strong>Aislamiento y Confidencialidad:</strong> Los detectives únicamente acceden
                  a sus propios expedientes. Los comisarios administran todo el archivo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-alerta font-bold">2.</span>
                <span>
                  <strong>Integridad de Casos Cerrados:</strong> Ningún caso archivado o cerrado
                  permite registrar nuevas evidencias o sospechosos.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-alerta font-bold">3.</span>
                <span>
                  <strong>Almacenamiento Pericial Real:</strong> Todas las fotografías se guardan
                  como archivos binarios en el bucket de almacenamiento, preservando URLs
                  auditables.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. SECCIÓN: INVITACIÓN AL REGISTRO Y LLAMADO FINAL
         =================================================================== */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto w-full text-center space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-papel">
            {isAuthenticated
              ? 'Panel de Control de Investigaciones Criminales'
              : 'Incorpórese a la Unidad de Investigación Criminal'}
          </h2>
          <p className="text-xs sm:text-sm text-papel-dark max-w-xl mx-auto font-sans leading-relaxed">
            {isAuthenticated
              ? 'Consulte los casos bajo su jurisdicción, declare sospechosos y aporte pruebas materiales a la cadena de custodia activa.'
              : 'Genere su credencial oficial para dar apertura a nuevos expedientes o inicie sesión si ya cuenta con acreditación pericial.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          {isAuthenticated ? (
            <Link
              href="/cases"
              className="px-6 py-3 bg-evidencia hover:bg-evidencia-hover text-white font-mono text-xs uppercase tracking-wider transition-colors shadow"
            >
              EXPLORAR EXPEDIENTES FORENSES &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3 bg-evidencia hover:bg-evidencia-hover text-white font-mono text-xs uppercase tracking-wider transition-colors shadow"
              >
                INGRESAR AL SISTEMA
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 bg-grafito border border-grafito-light hover:bg-grafito-light text-papel font-mono text-xs uppercase tracking-wider transition-colors"
              >
                SOLICITAR ALTA DE AGENTE
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
