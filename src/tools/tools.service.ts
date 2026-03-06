import { Injectable, Logger } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import * as cheerio from 'cheerio'

@Injectable()
export class ToolsService {
    private readonly logger = new Logger(ToolsService.name)

    async getTRM(): Promise<string> {
        try {
            this.logger.log('Obteniendo TRM del Banco de la República...')

            const { data } = await axios.get(
                'https://www.banrep.gov.co/es/estadisticas/trm',
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                }
            )

            const $ = cheerio.load(data)

            // Buscar el valor de la TRM en la página
            let trm = ''
            $('table').each((i, table) => {
                const text = $(table).text()
                if (text.includes('TRM') || text.includes('dólar')) {
                    const match = text.match(/[\d.,]{4,10}/)
                    if (match) trm = match[0]
                }
            })

            if (trm) {
                this.logger.log(`TRM encontrada: ${trm}`)
                return `💵 *TRM del día*\n\n1 USD = $${trm} COP\n\n_Fuente: Banco de la República de Colombia_`
            }

            return await this.getTRMFallback()

        } catch (error) {

            const axiosError = error as AxiosError
            this.logger.error('Error obteniendo TRM:', axiosError.response?.data)


            return await this.getTRMFallback()
        }
    }

    private async getTRMFallback(): Promise<string> {
        try {
            // API alternativa gratuita
            const { data } = await axios.get(
                'https://api.exchangerate-api.com/v4/latest/USD'
            )

            const cop = data.rates?.COP
            if (cop) {
                return `💵 *TRM del día*\n\n1 USD = $${cop.toLocaleString('es-CO')} COP\n\n_Fuente: ExchangeRate API_`
            }

            return '⚠️ No pude obtener la TRM en este momento. Intenta más tarde.'

        } catch (error) {
            const axiosError = error as AxiosError
            this.logger.error('Error en fallback TRM:', axiosError.response?.data)
            return '⚠️ No pude obtener la TRM en este momento. Intenta más tarde.'
        }
    }
}