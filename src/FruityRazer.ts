/*
 *  FruityUI - An UI for FruityRazer
 *  Copyright (C) 2018 Eduardo Almeida
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import axios from 'axios';

class FruityRazer {
  public static BaseURL = 'http://localhost:24577';

  public static async getDeviceList() {
    try {
      const response = await axios.get(FruityRazer.BaseURL + '/devices');

      if (response.data.devices) {
        return response.data.devices;
      }
    } catch (e) {
      // Do nothing for now
    }

    return null;
  }

  public static async sendLightingMessage(device: string, args: any) {
    try {
      const response = await axios.post(
        FruityRazer.BaseURL + '/devices/' + device + '/lighting',
        args,
      );

      if (response.data.success) {
        return true;
      }
    } catch (e) {
      // Do nothing for now
    }

    return false;
  }
}

export default FruityRazer;
