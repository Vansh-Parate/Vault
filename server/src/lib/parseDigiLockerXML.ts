import { XMLParser } from 'fast-xml-parser'

export type DigiLockerDocType = 'aadhaar' | 'pan' | 'driving_license'

type Parsed = Record<string, any>

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: false,
  trimValues: true,
})

const get = (obj: any, path: string[]): any => {
  let cur = obj
  for (const p of path) {
    if (cur == null) return undefined
    cur = cur[p]
  }
  return cur
}

const normalizeGender = (g?: string) => {
  const v = (g || '').toLowerCase()
  if (v === 'm' || v === 'male') return 'Male'
  if (v === 'f' || v === 'female') return 'Female'
  if (!v) return undefined
  return g
}

const safeAadhaarLast4 = (uid?: string) => {
  if (!uid) return undefined
  const digits = uid.replace(/\D/g, '')
  if (digits.length < 4) return undefined
  return digits.slice(-4)
}

export function parseDigiLockerXML(xmlString: string, docType: DigiLockerDocType): Parsed {
  const data = parser.parse(xmlString)

  if (docType === 'aadhaar') {
    const uidData = get(data, ['Certificate', 'CertificateData', 'KycRes', 'UidData'])
    const poi = uidData?.Poi
    const poa = uidData?.Poa
    // In Sandbox XML the Aadhaar is usually an attribute: <UidData uid="xxxxxxxx0920">
    // Fallbacks in case of slightly different casing/structure.
    const uid =
      (uidData?.uid as string | undefined) ||
      (uidData?.Uid as string | undefined) ||
      (uidData?.aadhaar as string | undefined)

    const addrParts = [
      poa?.house,
      poa?.street,
      poa?.loc || poa?.vtc,
      poa?.dist,
      poa?.state,
    ].filter(Boolean)

    const pc = poa?.pc
    const address = addrParts.length
      ? `${addrParts.join(', ')}${pc ? ` - ${pc}` : ''}`
      : undefined

    return {
      fullName: poi?.Name,
      dateOfBirth: poi?.Dob,
      gender: normalizeGender(poi?.Gender),
      aadhaarLast4: safeAadhaarLast4(uid),
      address,
      state: poa?.state,
      pincode: poa?.pc,
      idType: 'Aadhaar',
      issuingAuthority: 'UIDAI',
    }
  }

  if (docType === 'pan') {
    const panData = get(data, ['ITDPANCard', 'PANData'])
    return {
      fullName: panData?.Name,
      panNumber: panData?.PANNo,
      dateOfBirth: panData?.DOB,
      fatherName: panData?.FatherName,
      idType: 'PAN',
    }
  }

  const dlData = get(data, ['DriveingLicense', 'DLData']) || get(data, ['DrivingLicense', 'DLData'])
  return {
    fullName: dlData?.Name,
    dlNumber: dlData?.DLNo,
    dateOfBirth: dlData?.DOB,
    issuedDateRaw: dlData?.DOI,
    expiryDateRaw: dlData?.DOE,
    address: dlData?.Address,
    vehicleClasses: dlData?.VehicleClass,
    idType: 'Driving License',
  }
}

